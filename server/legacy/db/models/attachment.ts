import Prisma from "src/db/prisma";
import { S3 } from "src/helpers";

class Attachment {
  public upload = async (companyId, id, type, file, ctx, info?) => {
    const { stream, filename, mimetype } = await file;
    const uploadedFile = await S3.uploadFile(companyId, type, {
      id,
      stream,
      fileName: filename,
      mimetype,
    });
    const attachment = await Prisma.mutation.createAttachment({
      data: {
        description: "",
        fileName: filename,
        label: filename,
        url: uploadedFile.Location,
        s3Bucket: uploadedFile.Bucket,
        s3Key: uploadedFile.Key,
      },
    });
    return attachment;
  };

  public modifyAttachment = async (
    companyId,
    id,
    type,
    file,
    attachmentId,
    ctx,
    info?,
  ) => {
    const { stream, filename, mimetype } = await file;
    const uploadedFile = await S3.uploadFile(companyId, type, {
      id,
      stream,
      fileName: filename,
      mimetype,
    });
    const attachment = await Prisma.mutation.updateAttachment({
      data: {
        description: "",
        fileName: filename,
        label: filename,
        url: uploadedFile.Location,
        s3Bucket: uploadedFile.Bucket,
        s3Key: uploadedFile.Key,
      },
      where: {
        id: attachmentId,
      },
    });
    return attachment;
  };
}

export default new Attachment();
