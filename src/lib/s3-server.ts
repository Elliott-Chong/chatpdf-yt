import { S3 } from "@aws-sdk/client-s3";
import fs from "fs";
export async function downloadFromS3(file_key: string) {
  try {
    const s3 = new S3({
      region: "ap-southeast-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
      },
    });
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
    };

    const obj = await s3.getObject(params);
    const file_name = `./meow.pdf`;
    if (obj.Body instanceof require("stream").Readable) {
      // AWS-SDK v3 has some issues with their typescript definitions, but this works
      // https://github.com/aws/aws-sdk-js-v3/issues/843
      // @ts-ignore
      obj.Body?.pipe(fs.createWriteStream(file_name));
    }
    return file_name;
  } catch (error) {
    console.error(error);
    return null;
  }
}

downloadFromS3("uploads/1693568801787chongzhisheng_resume.pdf");
