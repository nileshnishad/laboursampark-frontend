# Profile Photo Cropping Feature Guide

## Overview
Enhanced profile photo uploads with image cropping functionality to ensure all profile pictures are properly formatted as 100×100 pixels. This feature has been implemented for:
- **Labour Registration Form**: Profile Photo cropping
- **Contractor Registration Form**: Company Logo cropping

## Features Implemented

### 1. **Image Cropping Modal**
- **Component**: `app/components/ImageCropperModal.tsx`
- **Features**:
  - Interactive image cropping with drag & zoom controls
  - 1:1 aspect ratio (square format) for consistent profile pictures
  - Real-time zoom slider (1x to 3x magnification)
  - Visual grid overlay for precise alignment
  - Side-by-side preview comparison (before/after)
  - Automatic conversion to 100×100 pixel format
  - JPEG compression for optimized file size

### 2. **Labour Registration Form Changes**
**File**: `app/register/LabourRegisterForm.tsx`

#### New States:
```typescript
const [showCropper, setShowCropper] = useState<boolean>(false);
const [tempImageSrc, setTempImageSrc] = useState<string>("");
const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("");
```

#### Updated Upload Flow:
1. User selects image file
2. File type & size validation
3. Cropper modal opens with preview
4. User adjusts zoom and positioning
5. Clicks "Use This Photo" to crop and upload
6. Cropped 100×100 image uploaded to S3
7. Preview displayed next to upload button
8. Success message shown

#### New Functions:
- `handleProfilePhotoUpload()`: Opens cropper modal instead of direct upload
- `handleCropComplete()`: Uploads cropped image to S3

#### UI Enhancements:
- Label shows "(100×100)" to indicate format
- Preview thumbnail with green border after upload
- Upload helper text: "Click to select image • Crop to square • Max 10MB"
- Side-by-side preview layout
- File size increased to 10MB (original only)

### 3. **Contractor Registration Form Changes**
**File**: `app/register/ContractorRegisterForm.tsx`

#### New States:
```typescript
const [showLogoCropper, setShowLogoCropper] = useState<boolean>(false);
const [tempLogoSrc, setTempLogoSrc] = useState<string>("");
const [companyLogoPreview, setCompanyLogoPreview] = useState<string>("");
```

#### Updated Upload Flow:
- Same as Labour form but for company logo
- Converted to 100×100 square format for consistency

#### New Functions:
- `handleCompanyLogoUpload()`: Opens cropper modal for logo
- `handleLogoCropComplete()`: Uploads cropped logo to S3

#### UI Enhancements:
- Logo preview with rounded corners (instead of circular for labour)
- Same upload helper text and validation
- Indigo color scheme (matching contractor form theme)

## Image Cropping Modal Details

### User Interactions:
- **Drag**: Move image within crop area
- **Scroll/Mouse Wheel**: Zoom in/out (on desktop)
- **Zoom Slider**: Manually adjust zoom percentage
- **Grid Lines**: Visual guides for alignment
- **Preview Pane**: See how image will look at 100×100
- **Submit Button**: "Use This Photo" to confirm crop
- **Cancel Button**: Discard and pick different image

### Technical Process:
1. Original image loaded into cropper
2. User positions and zooms image
3. When "Use This Photo" clicked:
   - Canvas element created (100×100)
   - Cropped area drawn to canvas
   - Canvas converted to JPEG blob
   - File object created from blob
   - Uploaded to S3 via `uploadFile()`

### Validation:
- File type validation: Only images accepted
- File size: Max 10MB before cropping
- Output: Always 100×100 pixels
- Format: JPEG compression
- Quality: Maintained during conversion

## Installation

### Dependencies Added:
```bash
npm install react-easy-crop
```

### Files Created:
- `app/components/ImageCropperModal.tsx` - Cropping modal component

### Files Modified:
- `app/register/LabourRegisterForm.tsx` - Added profile photo cropping
- `app/register/ContractorRegisterForm.tsx` - Added company logo cropping

## User Experience Flow

### Labour Profile Photo:
```
Select Image → Show Cropper Modal → User Adjusts → Preview → Upload → Success
     ↓
   10MB Max File
   Only Image Files
```

### Contractor Company Logo:
```
Select Image → Show Cropper Modal → User Adjusts → Preview → Upload → Success
     ↓
   10MB Max File
   Only Image Files
   100×100 Square Format
```

## Code Examples

### Labour Form Usage:
```tsx
// In form JSX
<div>
  <label>Profile Photo (100×100)</label>
  <input
    type="file"
    accept="image/*"
    onChange={handleProfilePhotoUpload}
  />
  {profilePhotoPreview && (
    <img src={profilePhotoPreview} className="w-24 h-24 rounded-full" />
  )}
</div>

// Cropper Modal
{showCropper && (
  <ImageCropperModal
    imageSrc={tempImageSrc}
    onCropComplete={handleCropComplete}
    onCancel={() => setShowCropper(false)}
  />
)}
```

### Contractor Form Usage:
```tsx
// Same pattern but for company logo
// with showLogoCropper, tempLogoSrc, handLogoCropComplete
```

## Styling & Theme Support

### Dark Mode:
- ✅ Modal background: `dark:bg-gray-800`
- ✅ Text colors: `dark:text-white`
- ✅ Border colors: `dark:border-gray-600`
- ✅ Preview containers: `dark:bg-gray-700`

### Color Schemes:
- **Labour Form**: Blue theme (blue-600, blue-400)
- **Contractor Form**: Indigo theme (indigo-400)

## Performance Considerations

### Image Processing:
- Canvas API used for client-side cropping (no server round-trips)
- JPEG compression reduces file size
- Max original file: 10MB (before cropping)
- Output: Always ~3-5KB after 100×100 compression

### Browser Support:
- Requires HTML5 Canvas API
- Requires FileReader API
- Requires modern browser (ES6+)
- Mobile-friendly with touch support (via react-easy-crop)

## Security Features

### File Validation:
1. **Type Check**: Only `image/*` MIME types accepted
2. **Size Check**: 10MB maximum before processing
3. **Client-side Processing**: Image never sent to server without cropping
4. **Filename Generation**: `profile-photo-{timestamp}` prevents collisions
5. **S3 Folder Structure**: `/labour/` and `/contractor/` subdirectories

## Testing Checklist

- [ ] Upload image < 1MB - Should crop and upload successfully
- [ ] Upload image > 10MB - Should show size error
- [ ] Upload non-image file - Should show type error
- [ ] Drag image in cropper - Should move image
- [ ] Adjust zoom slider - Should zoom correctly
- [ ] Click "Use This Photo" - Should upload cropped version
- [ ] Check S3 - File should be exactly 100×100
- [ ] Check preview - Should show cropped image next to input
- [ ] Cancel cropper - Should clear temp image
- [ ] Multiple uploads - Should allow updating photo
- [ ] Dark mode - Should display correctly

## Future Enhancements

1. **Brightness/Contrast Controls**: Allow image adjustments before cropping
2. **Filter Effects**: Sepia, grayscale, blur options
3. **Aspect Ratio Options**: Allow 16:9 or other ratios
4. **Drag to Replace**: Drag image directly to input to replace
5. **AI Crop Suggestion**: Automatically detect face for portrait mode
6. **Batch Processing**: Crop multiple images at once
7. **Camera Integration**: Direct photo capture from device camera
8. **History**: Undo/Redo crop adjustments

## Troubleshooting

### Cropper Modal Not Opening
- Verify `react-easy-crop` is installed
- Check console for import errors
- Ensure file is selected and validated

### Image Not Uploading After Crop
- Check S3 credentials and permissions
- Verify bucket CORS configuration
- Check network tab for upload errors
- Ensure file size after cropping < 5MB

### Preview Not Showing
- Clear browser cache
- Verify `companyLogoPreview` state is being set
- Check `URL.createObjectURL()` is working

### Crop Shape Wrong
- Verify `cropShape="round"` for labour (circular)
- No cropShape specified for contractor (square)
- Check aspect ratio is 1:1

## Dependencies

### Direct:
- `react-easy-crop`: ^4.5.0 (or latest)
- `react`: ^18.0.0 (already installed)
- `react-dom`: ^18.0.0 (already installed)

### Peer Dependencies:
- TypeScript 4.5+ (for type definitions)
- Tailwind CSS (for styling)

## Related Documentation

- [S3 Client Setup](S3_SETUP_GUIDE.md)
- [Image Upload Best Practices](S3_SIMPLIFIED_GUIDE.md)
- [Registration Form Guide](INTEGRATION_GUIDE.md)
