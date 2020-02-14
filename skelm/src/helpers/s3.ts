import AWS from "aws-sdk";
import {
  IS3AttachmentData,
  S3_ATTACHMENT,
  S3_BUCKET,
  S3_SIGNED_URL_EXPIRY,
} from "src/helpers/constants";

class S3 {
  public s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  public listBuckets() {
    return this.s3.listBuckets().promise();
  }

  public getSignedUrl({ bucket, key }: { bucket?: string; key: string }) {
    return this.s3.getSignedUrl("getObject", {
      Bucket: bucket || S3_BUCKET,
      Key: key,
      Expires: S3_SIGNED_URL_EXPIRY,
    });
  }

  public async getFile({ bucket, key }: { bucket?: string; key: string }) {
    const file = await this.s3
      .getObject({
        Bucket: bucket || S3_BUCKET,
        Key: key,
      })
      .promise();
    return file;
  }

  public async uploadFile(companyId, type: string, data: IS3AttachmentData) {
    const file = await this.s3
      .upload({
        Bucket: S3_BUCKET,
        Key: S3_ATTACHMENT[type].s3Key(companyId, data),
        Body: data.stream,
        ContentType: data.mimetype,
        ACL: S3_ATTACHMENT[type].permission,
      })
      .promise();
    return file;
  }
}

export default new S3();
