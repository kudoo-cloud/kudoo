import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import attachment from "src/db/models/attachment";
import { S3 } from "src/helpers";

export default {
  Mutation: {
    uploadAttachment: async (_, { data }, ctx, info) => {
      const { id, type, file } = data;
      const companyId = get(ctx, "auth.company.id");
      if (!companyId) {
        throw new ValidationError("company id is missing or invalid in header");
      }
      return await attachment.upload(companyId, id, type, file, ctx, info);
    },
    uploadAttachments: async (_, { data }, ctx, info) => {
      const companyId = get(ctx, "auth.company.id");
      if (!companyId) {
        throw new ValidationError("company id is missing or invalid in header");
      }
      const attachmentRes = [];
      for (const item of data) {
        const { id, type, file } = item;
        const attachObj = await attachment.upload(
          companyId,
          id,
          type,
          file,
          ctx,
          info,
        );
        if (attachObj) {
          attachmentRes.push(attachObj);
        }
      }
      return attachmentRes;
    },
    deleteAttachment: async (_, { where }, ctx, info) => {
      return await ctx.db.mutation.deleteAttachment(
        {
          where: {
            id: where.id,
          },
        },
        info,
      );
    },
  },
  Attachment: {
    url: async (parent, args, ctx, info) => {
      if (parent.s3Key && parent.s3Bucket) {
        return S3.getSignedUrl({ bucket: parent.s3Bucket, key: parent.s3Key });
      }
      return parent.url;
    },
  },
};
