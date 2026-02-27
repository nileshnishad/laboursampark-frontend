# AWS S3 File Upload - Simple Setup Guide

## Overview
Simple direct S3 upload using presigned URLs. User selects file → we get upload URL from backend → upload directly to S3 → return URL.

## How It Works

```
1. User selects file in form
   ↓
2. Frontend calls POST /api/upload-url
   → Send: { filename, fileType }
   ← Get: { uploadUrl, fileUrl }
   ↓
3. Frontend uploads directly to S3 using presigned URL
   → PUT presignedUrl with file
   ← 200 OK
   ↓
4. Store fileUrl in form state
   ↓
5. Submit form with S3 URLs to backend
```

## Files

**Backend API Route:** [app/api/upload-url.ts](app/api/upload-url.ts)
- Generates presigned URL for S3 upload
- Returns upload URL + file URL

**Frontend Upload Utility:** [lib/s3-client.ts](lib/s3-client.ts)
- `uploadFile(filename, file)` - Single function to get URL and upload

**Form Integration:** [app/register/ContractorRegisterForm.tsx](app/register/ContractorRegisterForm.tsx)
- `handleBusinessLicenseUpload()` - Upload business license
- `handleCompanyLogoUpload()` - Upload company logo
- Real-time upload status (uploading/success/error)

## AWS Setup

### 1. Create S3 Bucket

```bash
aws s3 mb s3://laboursampark --region ap-southeast-2
```

### 2. Enable CORS

S3 Console → laboursampark → Permissions → CORS Configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### 3. Create IAM User

AWS IAM → Create User → Attach Policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject"],
      "Resource": "arn:aws:s3:::laboursampark/*"
    }
  ]
}
```

### 4. Get Access Keys

User → Security Credentials → Create Access Key (save both keys)

### 5. Add to `.env.local`

```env
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJal...
S3_BUCKET=laboursampark
```

## Usage in Form

```typescript
import { uploadFile } from "@/lib/s3-client";

const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const fileUrl = await uploadFile(`my-file-${Date.now()}`, file);
    setFileUrl(fileUrl); // Save URL to form state
  } catch (error) {
    console.error("Upload failed", error);
  }
};
```

## File URL Format

After upload, you get a URL like:

```
https://laboursampark.s3.ap-southeast-2.amazonaws.com/1707303600000-business-license.pdf
```

## Test Upload

```bash
# Start dev server
npm run dev

# Go to contractor registration
http://localhost:3000/register?type=contractor

# Select a file and watch it upload
# Check S3 console to verify file appears
aws s3 ls s3://laboursampark/ --recursive
```

## Key Points

- ✅ No file size limits on backend
- ✅ Direct client-to-S3 upload (faster)
- ✅ Real-time upload status feedback
- ✅ URLs returned and stored in form
- ✅ Simple single function: `uploadFile()`
- ✅ Presigned URL expires in 1 hour

## Troubleshooting

**Files not uploading?**
- Check AWS credentials in `.env.local`
- Verify CORS is enabled in S3 bucket
- Check file size (currently 5MB limit in form)

**CORS policy error?**
- Enable CORS in S3 bucket settings
- Add your domain to AllowedOrigins

**Access Denied?**
- Verify IAM user has `s3:PutObject` permission
- Check bucket name matches `S3_BUCKET`

## Next Steps

1. Configure AWS credentials
2. Enable CORS in S3 bucket
3. Test file upload
4. Apply same pattern to labour registration
