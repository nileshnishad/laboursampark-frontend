# S3 File Upload Configuration Guide

## Overview
This application uses AWS S3 presigned URLs to upload files directly from the client to S3, bypassing the backend. This provides:
- **Faster uploads**: Direct client-to-S3 upload
- **Better UX**: Real-time upload progress
- **Cost efficient**: Reduced backend processing
- **Organized storage**: Files organized in `contractor/` and `labour/` folders

## Architecture

```
ContractorRegisterForm (Client)
    ↓
uploadFileWithPresignedUrl() [lib/s3-client.ts]
    ↓ (1) Get presigned URL
    ↓
/api/upload-url (API Route)
    ↓ (generates presigned URL)
    ↓ (2) Returns URL
S3 Client [lib/s3-client.ts]
    ↓ (3) Upload directly
    ↓
AWS S3 Bucket
```

## S3 Folder Structure

```
laboursampark/               (S3 Bucket)
├── contractor/             (Contractor files)
│   ├── 1707303600000-a1b2c3-business-license-1707303600000.pdf
│   └── 1707303660000-x9y8z7-company-logo-1707303660000.png
└── labour/                 (Labour files)
    └── 1707303700000-m5n4o3-profile-photo-1707303700000.jpg
```

## AWS Setup Instructions

### 1. Create S3 Bucket

```bash
aws s3 mb s3://laboursampark --region ap-southeast-2
```

### 2. Enable CORS on Bucket

S3 → laboursampark → Permissions → CORS Configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://yourdomain.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### 3. Create IAM User

1. Go to AWS IAM → Users → Create User
2. Set username: `laboursampark-app`
3. Attach inline policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::laboursampark/*"
    }
  ]
}
```

### 4. Generate Access Keys

1. User → Security Credentials → Create Access Key
2. Choose "Application running outside AWS"
3. Save the Access Key ID and Secret Access Key

### 5. Configure Environment Variables

Add to `.env.local`:

```env
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
S3_BUCKET=laboursampark
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Files Modified

### New Files
- `app/api/upload-url.ts` - API route for generating presigned URLs
- `lib/s3-client.ts` - Client-side S3 utilities

### Updated Files
- `app/register/ContractorRegisterForm.tsx` - File upload integration
- `store/slices/authSlice.ts` - Updated payload interfaces to use URLs
- `.env.example` - AWS configuration template

## Implementation Details

### File Upload Flow

```typescript
// 1. User selects file
<input type="file" onChange={handleBusinessLicenseUpload} />

// 2. Handler calls uploadFileWithPresignedUrl
await uploadFileWithPresignedUrl({
  filename: "business-license-1707303600000",
  file: File,
  userType: "contractor"
})

// 3. Frontend requests presigned URL from backend
POST /api/upload-url
→ {"filename", "fileType", "userType"}
← {"uploadUrl", "fileUrl", "key"}

// 4. Frontend uploads directly to S3
PUT presignedUrl
→ File content
← 200 OK

// 5. Save returned fileUrl to form state
setBusinessLicenseUrl(fileUrl)

// 6. Submit form with S3 URLs
dispatch(registerContractor({
  ...formData,
  businessLicenseUrl: "https://laboursampark.s3.ap-southeast-2.amazonaws.com/contractor/...",
  companyLogoUrl: "https://laboursampark.s3.ap-southeast-2.amazonaws.com/contractor/..."
}))
```

### Key Features

**Client-side validation:**
```typescript
// Max 5MB file size
if (file.size > 5 * 1024 * 1024) {
  setUploadErrors("File size must be less than 5MB");
  return;
}
```

**Upload status tracking:**
```typescript
uploadStatus: {
  businessLicense: "idle" | "uploading" | "success" | "error",
  companyLogo: "idle" | "uploading" | "success" | "error"
}
```

**Real-time feedback:**
- Spinning loader while uploading
- Green checkmark on success
- Red error message on failure
- File size validation

## Testing

### Local Testing

```bash
# 1. Start development server
npm run dev

# 2. Navigate to contractor registration
http://localhost:3000/register?type=contractor

# 3. Select a file and watch upload
# - Should see spinner during upload
# - Should see green checkmark after 1-2 seconds
# - Can verify in S3 console

# 4. Submit form
# - Check console for formPayload
# - URL fields should contain S3 URLs
```

### Verify S3 Upload

```bash
# List files in bucket
aws s3 ls s3://laboursampark/contractor/ --recursive

# Get file URL (public if bucket allows)
https://laboursampark.s3.ap-southeast-2.amazonaws.com/contractor/1707303600000-a1b2c3-business-license.pdf
```

## Presigned URL Details

- **Expiry**: 3600 seconds (1 hour)
- **Method**: PUT (direct upload)
- **Automatically includes**: Content-Type header
- **Format**: `https://bucket.s3.region.amazonaws.com/key?X-Amz-Algorithm=...&X-Amz-Signature=...`

## Security Considerations

1. **IAM Policy**: Restrict to specific bucket and prefix
2. **CORS**: Only allow trusted origins
3. **Presigned URL expiry**: Set to 1 hour (can adjust)
4. **File validation**: Check size and type on client
5. **Backend validation**: Verify file URLs before saving to database
6. **S3 Objects**: Consider adding object-level ACLs if needed

## Troubleshooting

### "CORS policy: Response to preflight request doesn't pass"
→ Fix CORS configuration in S3 bucket settings

### "Access Denied" errors
→ Check IAM user permissions and S3 bucket policy

### Files not uploading
→ Check AWS credentials in `.env.local`
→ Verify bucket name matches `S3_BUCKET`
→ Check file size doesn't exceed 5MB

### 404 file not found after upload
→ Verify S3 bucket is public or credentials have access
→ Check object prefix path in S3 Key generation

## Next Steps

1. ✅ Configure AWS credentials in `.env.local`
2. ✅ Update CORS policy in S3 bucket
3. ✅ Test file upload in form
4. ✅ Verify files appear in S3 console
5. ⏳ Create LabourRegisterForm with similar upload flow
6. ⏳ Add backend validation for file URLs
7. ⏳ Store file URLs in database with registration

## References

- [AWS S3 Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
- [S3 CORS Configuration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html)
- [AWS SDK S3 Client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
