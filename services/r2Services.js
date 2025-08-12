import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_ENDPOINT = process.env.R2_ENDPOINT;

const R2 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const streamToBuffer = stream => {
  return new Promise((res, rej) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', rej);
    stream.on('end', () => res(Buffer.concat(chunks)));
  });
};

const uploadFileToR2 = async (key, body, contentType) => {
  await R2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
};

const getFileFromR2 = async key => {
  const { Body } = await R2.send(
    new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })
  );

  return streamToBuffer(Body)
};

const deleteFileFromR2 = async key => {
  await R2.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key
    })
  )
}

export { uploadFileToR2, getFileFromR2, deleteFileFromR2 };
