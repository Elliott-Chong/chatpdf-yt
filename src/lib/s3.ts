import { PutObjectCommandOutput, S3 } from "@aws-sdk/client-s3";

export async function uploadToS3(file: File) {
  try {
    const s3 = new S3({
      region: "ap-southeast-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
      },
    });

    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: file,
    };
    s3.putObject(
      params,
      (err: any, data: PutObjectCommandOutput | undefined) => {
        return Promise.resolve({
          file_key,
          file_name: file.name,
        });
      }
    );

    // const upload = s3
    //   .putObject(params)
    //   .on("httpUploadProgress", (evt) => {
    //     console.log(
    //       "uploading to s3...",
    //       parseInt(((evt.loaded * 100) / evt.total).toString())
    //     ) + "%";
    //   })
    //   .promise();

    // await upload.then((data) => {
    //   console.log("successfully uploaded to S3!", file_key);
    // });
  } catch (error) {}
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-southeast-1.amazonaws.com/${file_key}`;
  return url;
}
