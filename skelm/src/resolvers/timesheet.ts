import { Mail } from "@kudoo/email";
import { ForbiddenError, ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import attachment from "src/db/models/attachment";
import customer from "src/db/models/customer";
import project from "src/db/models/project";
import service from "src/db/models/service";
import timesheet from "src/db/models/timesheet";
import { S3 } from "src/helpers";
import {
  COMPANY_MEMBER_ROLE,
  ERRORS,
  S3_ATTACHMENT,
  VIZIER_URL,
} from "src/helpers/constants";

const validateTimeSheetEntries = async (entries, ctx) => {
  // validationPassMap is mapping of id to true/false to reduce database call in next for-loop
  const validationPassMap = {
    projects: {},
    service: {},
    customer: {},
  };

  // iterate through all entries
  for (const entry of entries) {
    // if user want to connect entry with project
    const projectId = get(entry, "project.connect.id");
    if (projectId) {
      // if project id is not already checked
      if (!validationPassMap.projects[projectId]) {
        const projectObj = await project.get(projectId, ctx);
        if (!projectObj) {
          throw new ForbiddenError(
            `Not allowed to create timesheet entry with given project: ${projectId}`,
          );
        } else {
          // if project is there , then store it in map
          validationPassMap.projects[projectId] = true;
        }
      }
    }

    // if user want to connect entry with service
    const serviceId = get(entry, "service.connect.id");
    if (serviceId) {
      // if service id is not already checked
      if (!validationPassMap.service[serviceId]) {
        const serviceObj = await service.get(serviceId, ctx);
        if (!serviceObj) {
          throw new ForbiddenError(
            `Not allowed to create timesheet entry with given service: ${serviceId}`,
          );
        } else {
          // if service is there then store it in map
          validationPassMap.service[serviceId] = true;
        }
      }
    }

    // if user want to connect entry with customer
    const customerId = get(entry, "customer.connect.id");
    if (customerId) {
      // if customer id is not already checked
      if (!validationPassMap.customer[customerId]) {
        const customerObj = await customer.get(customerId, ctx);
        if (!customerObj) {
          throw new ForbiddenError(
            `Not allowed to create timesheet entry with given customer: ${customerId}`,
          );
        } else {
          // if customer is there then store it in map
          validationPassMap.customer[customerId] = true;
        }
      }
    }
  }
};

const uploadAttachmentsAndPreview = async ({
  attachments = [],
  preview,
  timesheetObj,
  companyId,
  ctx,
}) => {
  const extraData: any = {};
  const attachRes = [];
  // check for attachments
  if (attachments.length > 0) {
    // iterate through all attachments
    for (const attach of attachments) {
      // upload attachment
      const res = await attachment.upload(
        companyId,
        timesheetObj.id,
        S3_ATTACHMENT.TIMESHEET_ATTACHMENT.type,
        attach,
        ctx,
      );
      attachRes.push({
        id: res.id,
      });
    }
    // create structure for connect uploaded attachment
    extraData.attachments = {
      connect: attachRes,
    };
  }

  // check for pdf preview
  if (preview) {
    // upload pdf
    const res = await attachment.upload(
      companyId,
      timesheetObj.id,
      S3_ATTACHMENT.TIMESHEET_PREVIEW.type,
      preview,
      ctx,
    );
    extraData.preview = {
      connect: {
        id: res.id,
      },
    };
  }

  return extraData;
};

export default {
  Query: {
    timeSheet: async (_, { where }, ctx, info) => {
      return await timesheet.get(where.id, ctx, info);
    },
    timeSheets: async (_, args, ctx, info) => {
      const userId = get(ctx, "auth.user.id");
      const companyId = get(ctx, "auth.company.id");
      const role = get(ctx, "auth.role");
      // by default get only logged in user's timesheet
      let userQuery: any = {
        user: {
          id: userId,
        },
      };
      // if logged in user is admin or owner,
      // then check whether he wants to get all workers timsheet by providing custom user query
      if (
        role === COMPANY_MEMBER_ROLE.ADMIN ||
        role === COMPANY_MEMBER_ROLE.OWNER
      ) {
        // if argument has given specific user query then use it, or else get timesheet of logged in user only
        if (get(args, "where.user")) {
          userQuery = {
            user: get(args, "where.user"),
          };
        } else {
          // by default get timesheet for all workers
          userQuery = {};
        }
      }

      const timesheets = await ctx.db.query.timeSheetsConnection(
        {
          where: {
            ...args.where,
            isDeleted: false,
            company: {
              id: companyId,
            },
            ...userQuery,
          },
          orderBy: args.orderBy,
          skip: args.skip,
          after: args.after,
          before: args.before,
          first: args.first,
          last: args.last,
        },
        info,
      );
      return timesheets;
    },
  },
  Mutation: {
    createTimeSheet: async (_, { data }, ctx, info) => {
      const userId = get(ctx, "auth.user.id");
      const companyId = get(ctx, "auth.company.id");
      const timesheetEntries = get(data, "timeSheetEntries.create", []);
      await validateTimeSheetEntries(timesheetEntries, ctx);

      let timesheetObj = await ctx.db.mutation.createTimeSheet(
        {
          data: {
            endsAt: data.endsAt,
            startsAt: data.startsAt,
            status: data.status,
            timeSheetEntries: data.timeSheetEntries,
            isArchived: false,
            company: {
              connect: {
                id: companyId,
              },
            },
            user: {
              connect: {
                id: userId,
              },
            },
          },
        },
        info,
      );

      const extraData: any = await uploadAttachmentsAndPreview({
        attachments: data.attachments,
        preview: data.preview,
        ctx,
        companyId,
        timesheetObj,
      });

      // if there is attachment or pdf or both then execute update
      if (!isEmpty(extraData)) {
        timesheetObj = await ctx.db.mutation.updateTimeSheet(
          {
            data: extraData,
            where: {
              id: timesheetObj.id,
            },
          },
          info,
        );
      }

      return timesheetObj;
    },
    updateTimeSheet: async (_, { where, data }, ctx, info) => {
      const companyId = get(ctx, "auth.company.id");
      const timesheetObj = await timesheet.get(where.id, ctx, info);
      if (timesheetObj) {
        // Validate create timesheet entries
        const createTimesheetEntries = get(data, "timeSheetEntries.create", []);
        await validateTimeSheetEntries(createTimesheetEntries, ctx);

        // Validate update timesheet entries
        const updateTimesheetEntries = get(
          data,
          "timeSheetEntries.update",
          [],
        ).map((item) => item.data);
        await validateTimeSheetEntries(updateTimesheetEntries, ctx);

        // upload attachments and preview pdf
        const extraData = await uploadAttachmentsAndPreview({
          attachments: data.attachments,
          preview: data.preview,
          ctx,
          companyId,
          timesheetObj,
        });

        const res = await ctx.db.mutation.updateTimeSheet(
          {
            data: {
              endsAt: data.endsAt,
              isArchived: data.isArchived,
              startsAt: data.startsAt,
              status: data.status,
              timeSheetEntries: data.timeSheetEntries,
              ...extraData,
              company: {
                connect: {
                  id: companyId,
                },
              },
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
        return res;
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Timesheet"));
      }
    },
    deleteTimeSheet: async (_, { where }, ctx, info) => {
      const timesheetObj = await timesheet.get(where.id, ctx, info);
      if (timesheetObj) {
        return await ctx.db.mutation.updateTimeSheet(
          {
            data: {
              isDeleted: true,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Timesheet"));
      }
    },
    timeSheetApprove: async (_, { to, timeSheetId }, ctx) => {
      const timesheetObj = await timesheet.get(
        timeSheetId,
        ctx,
        `
				{
					id
					user {
						firstName
						lastName
					}
				}
				`,
      );
      Mail.send({
        templateName: Mail.TEMPLATES.time_sheet_approve,
        templateData: {
          url: VIZIER_URL.TIMESHEET_APPROVE(timeSheetId),
          first_name: get(timesheetObj, "user.firstName", ""),
          last_name: get(timesheetObj, "user.lastName", ""),
        },
        to,
      });
      return {
        success: true,
      };
    },
    timeSheetNotify: async (_, { to, bcc, cc, timeSheetId }, ctx) => {
      try {
        const timesheetObj = await timesheet.get(
          timeSheetId,
          ctx,
          `
					{
						id
						user {
							firstName
							lastName
						}
						preview {
							id
							description
							fileName
							label
							url
							s3Bucket
							s3Key
						}
					}
					`,
        );
        const previewFileKey = get(timesheetObj, "preview.s3Key");
        const previewFileBucket = get(timesheetObj, "preview.s3Bucket");
        const attachments = [];
        if (previewFileKey && previewFileBucket) {
          const data = await S3.getFile({
            bucket: previewFileBucket,
            key: previewFileKey,
          });
          const base64Content = new Buffer(data.Body as Buffer).toString(
            "base64",
          );
          attachments.push({
            content: base64Content,
            filename: get(timesheetObj, "preview.fileName"),
            type: "application/pdf",
          });
        }
        Mail.send({
          templateName: Mail.TEMPLATES.time_sheet_notify,
          templateData: {
            first_name: get(timesheetObj, "user.firstName", ""),
            last_name: get(timesheetObj, "user.lastName", ""),
            url: get(timesheetObj, "preview.url"),
          },
          to,
          bcc,
          cc,
          attachments,
        });
        return {
          success: true,
        };
      } catch (err) {
        console.error(err);
      }
    },
  },
};
