import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(req: Request) {
  const { filename, fileType } = await req.json();
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${Date.now()}-${filename}`,
    ContentType: fileType,
  };

  const command = new PutObjectCommand(params);
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

  const fileUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION || "ap-southeast-2"}.amazonaws.com/${params.Key}`;

  return new Response(
    JSON.stringify({ uploadUrl, fileUrl }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
