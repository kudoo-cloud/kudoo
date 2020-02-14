import get from "lodash/get";
import Prisma from "src/db/prisma";
import {
  COMPANY_MEMBER_ROLE,
  COMPANY_MEMBER_STATUS,
} from "src/helpers/constants";

class Company {
  public get = async (id, ctx, info = {} as any) => {
    const companyId = get(ctx, "auth.companyId");
    const userId = get(ctx, "auth.user.id");
    if (!companyId) {
      return null;
    }
    const companies = await Prisma.query.companies(
      {
        where: {
          id,
          isDeleted: false,
          companyMembers_some: {
            role_in: [COMPANY_MEMBER_ROLE.ADMIN, COMPANY_MEMBER_ROLE.OWNER],
            status: COMPANY_MEMBER_STATUS.ACTIVE,
            user: {
              id: userId,
            },
          },
        },
      },
      `
      {
        id
        bankAccount
        businessType
        country
        govNumber
        currency
        isArchived
        isDeleted
        HPIO
        legalName
        logo {
          id
          description
          fileName
          label
          url
          s3Bucket
          s3Key
          __typename
        }
        name
        salesTax
        timeSheetSettings
        websiteURL
        addresses {
          id
          street
          city
          state
          country
          postCode
          latitude
          longitude
          __typename
        }
        contacts {
          id
          name
          surname
          email
          mobileCode
          mobileNumber
          landlineCode
          landlineNumber
          __typename
        }
        companyMembers {
          id
          company {
            id
            name
            __typename
          }
          isArchived
          isDeleted
          role
          status
          user {
            id
            contactNumber
            email
            firstName
            isActive
            isArchived
            isDeleted
            isRoot
            jobTitle
            lastName
            password
            secondAuthEnabled
            __typename
          }
          __typename
        }
        activePlan {
          id
          company {
            id
            __typename
          }
          isActive
          isArchived
          isDeleted
          price
          type
          __typename
        }
        stripeCustomerId
      }
      `
    );
    return get(companies, "0", {});
  };
}

export default new Company();
