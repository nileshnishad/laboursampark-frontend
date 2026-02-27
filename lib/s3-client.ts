/**
 * Simple S3 Upload - Get URL and upload directly
 */

export async function uploadFile(filename: string, file: File, userType: "contractor" | "labour") {
  // Step 1: Get presigned URL from backend
  const response = await fetch("/api/upload-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename,
      fileType: file.type,
      userType,
    }),
  });

  const { uploadUrl, fileUrl } = await response.json();

  // Step 2: Upload file directly to S3
  await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  // Step 3: Return the file URL
  return fileUrl;
}
