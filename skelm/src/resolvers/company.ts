import { Mail } from "@kudoo/email";
import { ValidationError } from "apollo-server-errors";
import { isEmpty } from "lodash";
import {
  standardMainAccounts,
  standardPostings,
} from "../../stdData";
import get from "lodash/get";
import attachment from "src/db/models/attachment";
import company from "src/db/models/company";
import mainAccount from "src/db/models/mainAccount";
import ledgerPosting from "src/db/models/ledgerPosting";
import {
  COMPANY_MEMBER_ROLE,
  COMPANY_MEMBER_STATUS,
  ERRORS,
  S3_ATTACHMENT,
  SKELM_URL,
  PLAN_TYPE,
} from "src/helpers/constants";
import { signJWT } from "src/helpers/jwt";
import stripe from "src/helpers/stripe";
import idx from "idx";

export default {
  Query: {
    company: async (_, { where }, ctx, info) => {
      return await company.get(where.id, ctx, info);
    },
    companies: async (_, args, ctx, info) => {
      const { joined, created } = args;
      let companies = [];
      const companyQuery = {
        where: {
          isDeleted: false,
          companyMembers_some: {
            status: COMPANY_MEMBER_STATUS.ACTIVE,
            user: {
              id: ctx.auth.id,
            },
            isDeleted: false,
            role_in: [],
          },
        },
      };
      if (joined) {
        companyQuery.where.companyMembers_some.role_in = [
          COMPANY_MEMBER_ROLE.USER,
        ];
        const joinedCompanies = await ctx.db.query.companies(
          companyQuery,
          info
        );
        companies = [...companies, ...joinedCompanies];
      }
      if (created) {
        companyQuery.where.companyMembers_some.role_in = [
          COMPANY_MEMBER_ROLE.ADMIN,
          COMPANY_MEMBER_ROLE.OWNER,
        ];
        const createdCompanies = await ctx.db.query.companies(
          companyQuery,
          info
        );
        companies = [...companies, ...createdCompanies];
      }
      return companies;
    },
  },
  Mutation: {
    createCompany: async (_, { data }, ctx, info) => {
      let res = await ctx.db.mutation.createCompany(
        {
          data: {
            bankAccount: data.bankAccount,
            businessType: data.businessType,
            country: data.country,
            currency: data.currency,
            govNumber: data.govNumber,
            isArchived: false,
            legalName: data.legalName,
            name: data.name,
            HPIO: data.HPIO,
            salesTax: data.salesTax,
            // set default timeSheetSettings if it is not defined by user
            timeSheetSettings: {
              groupEvery: get(data, "timeSheetSettings.groupEvery", "MONTHLY"),
              workingHours: get(data, "timeSheetSettings.workingHours", 8),
              approvalsEnabled: get(
                data,
                "timeSheetSettings.approvalsEnabled",
                false
              ),
              autoSendInvoices: get(
                data,
                "timeSheetSettings.autoSendInvoices",
                false
              ),
            },
            websiteURL: data.websiteURL,
            addresses: data.addresses,
            contacts: data.contacts,
            // add first company member as owner(current user id)
            companyMembers: {
              create: [
                {
                  role: COMPANY_MEMBER_ROLE.OWNER,
                  status: COMPANY_MEMBER_STATUS.ACTIVE,
                  user: {
                    connect: {
                      id: ctx.auth.id,
                    },
                  },
                },
              ],
            },
            // By Default we assign FREE plan to every new company
            activePlan: {
              create: {
                price: 0,
                type: PLAN_TYPE.FREE,
                isActive: true,
                currency: data.currency,
              },
            },
          },
        },
        info
      );
      if (data.logo) {
        // If logo is there upload it to s3 and save result to logo field
        const uploadedAttachment = await attachment.upload(
          res.id,
          res.id,
          S3_ATTACHMENT.COMPANY_LOGO.type,
          data.logo,
          ctx,
          info
        );
        res = await ctx.db.mutation.updateCompany(
          {
            data: {
              logo: {
                connect: {
                  id: uploadedAttachment.id,
                },
              },
            },
            where: {
              id: res.id,
            },
          },
          info
        );
      }
      // Create Standard Main Account
      let mainAccCodeIdMapping = {};
      for (let i = 0; i < standardMainAccounts.length; i++) {
        try {
          const acc = standardMainAccounts[i];
          const mainAccRes = await mainAccount.create(acc, res.id);
          mainAccCodeIdMapping[acc.code] = mainAccRes.id;
        } catch (error) {
          console.log("standard createMainAccount error : ", error);
        }
      }
      // Create Standard Ledger Posting
      for (let i = 0; i < standardPostings.length; i++) {
        try {
          const posting = standardPostings[i];
          await ledgerPosting.create(
            {
              postingType: posting.postingType,
              mainAccount: {
                connect: {
                  id: mainAccCodeIdMapping[posting.mainAccount] || "",
                },
              },
            },
            res.id
          );
        } catch (error) {
          console.log("standard createLedgerPosting error : ", error);
        }
      }
      // create customer in stripe for later use
      const stripeCustomerRes = await stripe.createCustomer({
        email: idx(ctx, x => x.auth.user.email),
        description: `Company - ${data.name}`,
        name: data.name,
        metadata: {
          id: res.id,
        },
        tax_id_data: stripe.getTaxIdInformation(data.country, data.govNumber),
      });
      // create FREE subscription plan on create company
      await stripe.createSubscriptionPlan({
        customerId: stripeCustomerRes.id,
        planName: PLAN_TYPE.FREE,
        quantity: 1,
        metadata: {
          id: res.id,
        },
      });
      // update stripe customer id in company record
      await ctx.db.mutation.updateCompany(
        {
          data: { stripeCustomerId: stripeCustomerRes.id },
          where: { id: res.id },
        },
        info
      );
      return res;
    },
    updateCompany: async (_, { where, data }, ctx, info) => {
      const companyObj = await company.get(where.id, ctx, info);
      if (companyObj) {
        let res = await ctx.db.mutation.updateCompany(
          {
            data: {
              bankAccount: data.bankAccount,
              businessType: data.businessType,
              country: data.country,
              currency: data.currency,
              govNumber: data.govNumber,
              isArchived: data.isArchived,
              legalName: data.legalName,
              name: data.name,
              salesTax: data.salesTax,
              timeSheetSettings: data.timeSheetSettings,
              websiteURL: data.websiteURL,
              addresses: data.addresses,
              contacts: data.contacts,
              activePlan: data.activePlan,
              HPIO: data.HPIO,
            },
            where,
          },
          info
        );
        if (data.logo) {
          // If logo is there upload it to s3 and save result to logo field
          const uploadedAttachment = await attachment.upload(
            companyObj.id,
            companyObj.id,
            S3_ATTACHMENT.COMPANY_LOGO.type,
            data.logo,
            ctx,
            info
          );
          res = await ctx.db.mutation.updateCompany(
            {
              data: {
                logo: {
                  connect: {
                    id: uploadedAttachment.id,
                  },
                },
              },
              where: {
                id: res.id,
              },
            },
            info
          );
        }
        const contact =
          idx(data, x => x.contacts.create[0]) ||
          idx(data, x => x.contacts.update[0].data);
        const address =
          idx(data, x => x.addresses.create[0]) ||
          idx(data, x => x.addresses.update[0].data);
        let stripeUpdateData = {};
        if (!!contact) {
          stripeUpdateData = {
            ...stripeUpdateData,
            phone: `+${contact.mobileCode}${contact.mobileNumber}`,
          };
        }
        if (!!address) {
          stripeUpdateData = {
            ...stripeUpdateData,
            address: {
              city: address.city,
              country: address.country,
              line1: address.street,
              line2: "",
              postal_code: address.postalCode,
              state: address.state,
            },
          };
        }
        if (!isEmpty(stripeUpdateData)) {
          // update stripe data
          const stripeCustomer = await stripe.getCustomer(res.stripeCustomerId);
          await stripe.updateCustomer(stripeCustomer.id, stripeUpdateData);
        }
        return res;
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Company"));
      }
    },
    deleteCompany: async (_, { id }, ctx, info) => {
      const companyObj = await company.get(id, ctx, info);

      if (companyObj) {
        const res = await ctx.db.mutation.updateCompany(
          {
            data: {
              isDeleted: true,
            },
            where: {
              id,
            },
          },
          info
        );
        return res;
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Company"));
      }
    },
    undeleteCompany: async (_, { id }, ctx, info) => {
      const companyObj = await company.get(id, ctx, info);
      if (companyObj) {
        const res = await ctx.db.mutation.updateCompany(
          {
            data: {
              isDeleted: false,
            },
            where: {
              id,
            },
          },
          info
        );
        return res;
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Company"));
      }
    },
    invite: async (_, { email, role, baseURL }, ctx) => {
      const users = await ctx.db.query.users({
        where: {
          email,
        },
      });
      const foundUser = users[0];
      let userId = "";
      let type = "company";
      if (!foundUser) {
        // if user is not there, we need to create user
        const newUser = await ctx.db.mutation.createUser({
          data: {
            email,
          },
        });
        userId = newUser.id;
        type = "update";
      } else {
        userId = foundUser.id;
      }
      const companyId = get(ctx, "auth.company.id");
      const companyObj = await company.get(companyId, ctx);

      // get all not deleted company member for company to check whether user id being invited is already there or not
      const companyMembers = await ctx.db.query.companyMembers({
        where: {
          isDeleted: false,
          user: {
            id: userId,
          },
          company: {
            id: get(ctx, "auth.company.id"),
          },
        },
      });

      if (companyMembers && companyMembers.length > 0) {
        throw new ValidationError(ERRORS.MEMBER_ALREADY_EXIST);
      }

      const companyMember = await ctx.db.mutation.createCompanyMember({
        data: {
          isArchived: false,
          role,
          status: COMPANY_MEMBER_STATUS.PENDING,
          isDeleted: false,
          company: {
            connect: {
              id: get(ctx, "auth.company.id"),
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      const token = await signJWT({
        id: userId,
        companyMemberId: companyMember.id,
        companyId,
        fromInvite: true, // This flag will be helpful when decoding token in `updateUser` mutation
        baseURL,
      });

      if (companyObj.stripeCustomerId) {
        // Update Stripe Subscription to add one more quantity
        const stripeCustomer = await stripe.getCustomer(
          companyObj.stripeCustomerId
        );
        const quantity =
          idx(stripeCustomer, x => x.subscriptions.data[0].quantity) || 1;
        await stripe.changeSubscribtionPlan(companyObj.stripeCustomerId, {
          quantity: Number(quantity) + 1,
          type: "QUANTITY_UPDATE",
        });
      }

      Mail.send({
        templateName: Mail.TEMPLATES.invite,
        templateData: {
          first_name: get(ctx, "auth.user.firstName"),
          last_name: get(ctx, "auth.user.lastName"),
          token_url: SKELM_URL.ACCEPT_INVITE(type, token),
          company_name: get(ctx, "auth.company.name"),
          type,
        },
        to: [email],
      });

      return { success: true };
    },
    resendInvite: async (_, { email, role, companyMemberId, baseURL }, ctx) => {
      const users = await ctx.db.query.users({
        where: {
          email,
        },
      });
      const userId = users[0].id;
      const type = "update";

      const token = await signJWT({
        id: userId,
        companyMemberId,
        companyId: get(ctx, "auth.company.id"),
        fromInvite: true, // This flag will be helpful when decoding token in `updateUser` mutation
        baseURL,
      });

      Mail.send({
        templateName: Mail.TEMPLATES.invite,
        templateData: {
          first_name: get(ctx, "auth.user.firstName"),
          last_name: get(ctx, "auth.user.lastName"),
          token_url: SKELM_URL.ACCEPT_INVITE(type, token),
          company_name: get(ctx, "auth.company.name"),
          type,
        },
        to: [email],
      });

      return { success: true };
    },
    updateCompanyMember: async (_, { where, data }, ctx) => {
      return await ctx.db.mutation.updateCompanyMember({
        data: {
          isArchived: data.isArchived,
          role: data.role,
          status: data.status,
        },
        where: {
          id: where.id,
        },
      });
    },
    deleteCompanyMember: async (_, { id }, ctx) => {
      const companyId = get(ctx, "auth.company.id");
      const companyObj = await company.get(companyId, ctx);

      await ctx.db.mutation.deleteCompanyMember({
        where: {
          id,
        },
      });

      // Update Stripe Subscription to remove one quantity
      if (companyObj.stripeCustomerId) {
        const stripeCustomer = await stripe.getCustomer(
          companyObj.stripeCustomerId
        );
        const quantity =
          idx(stripeCustomer, x => x.subscriptions.data[0].quantity) || 1;
        await stripe.changeSubscribtionPlan(companyObj.stripeCustomerId, {
          quantity: Number(quantity) - 1,
          type: "QUANTITY_UPDATE",
        });
      }
      return {
        success: true,
      };
    },
    changeSubscriptionPlan: async (_, args, ctx) => {
      const companyId = get(ctx, "auth.companyId");
      const companyObj = await company.get(companyId, ctx);
      if (args.sourceToken) {
        // Incase user updated card information, then we will get new source token that we will use to update
        // Note: This should not be called every time, this is only when user add card first time or update the card info
        await stripe.updateCustomer(companyObj.stripeCustomerId, {
          source: args.sourceToken,
        });
      }
      await stripe.changeSubscribtionPlan(companyObj.stripeCustomerId, {
        toPlanName: args.toPlan,
        quantity: args.quantity,
        type: args.type,
      });
      return {
        success: true,
      };
    },
  },
};
