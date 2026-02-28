"use client";
import { useState, useCallback, useRef } from "react";
import ReactEasyCrop, { Area, Point } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";

interface ImageCropperModalProps {
  imageSrc: string;
  onCropComplete: (croppedImage: File) => void;
  onCancel: () => void;
}

interface Crop {
  x: number;
  y: number;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  imageSrc,
  onCropComplete,
  onCancel,
}) => {
  const [crop, setCrop] = useState<Crop>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [livePreviewUrl, setLivePreviewUrl] = useState<string>("");
  const [previewDimensions, setPreviewDimensions] = useState<{ width: number; height: number } | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const generateLivePreview = useCallback(
    async (pixelCrop: Area) => {
      try {
        console.log("Generating preview for pixel crop:", pixelCrop);
        const image = await createImage(imageSrc);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Ensure integer dimensions and clamp
        const width = Math.max(1, Math.round(pixelCrop.width));
        const height = Math.max(1, Math.round(pixelCrop.height));

        canvas.width = width;
        canvas.height = height;

        // Fill with white background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        // Draw the correct area from the source image using pixel coordinates
        ctx.drawImage(
          image,
          Math.max(0, Math.round(pixelCrop.x)),
          Math.max(0, Math.round(pixelCrop.y)),
          width,
          height,
          0,
          0,
          width,
          height,
        );

        // Store dimensions
        setPreviewDimensions({ width, height });

        // Create preview URL (revoke previous)
        canvas.toBlob((blob) => {
          if (blob) {
            if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
            const url = URL.createObjectURL(blob);
            setLivePreviewUrl(url);
            previewUrlRef.current = url;
            console.log("Preview URL created:", url);
          }
        }, "image/jpeg", 0.95);
      } catch (error) {
        console.error("Error generating live preview:", error);
      }
    },
    [imageSrc],
  );

  // Handler for react-easy-crop when the crop operation completes (pixel coords)
  const onCropAreaComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
      // Generate live preview using pixel coordinates
      generateLivePreview(croppedAreaPixels);
    },
    [generateLivePreview],
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (err) => reject(err));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
  ): Promise<File> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    // Use actual cropped dimensions
    const width = Math.round(pixelCrop.width);
    const height = Math.round(pixelCrop.height);
    
    canvas.width = width;
    canvas.height = height;

    // Fill with white background first
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw the cropped image
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      width,
      height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          const file = new File([blob], "profile-photo-cropped.jpg", {
            type: "image/jpeg",
          });
          resolve(file);
        },
        "image/jpeg",
        0.95, // Quality setting
      );
    });
  };

  const handleCropSubmit = async () => {
    if (!croppedAreaPixels) {
      alert("Please adjust the crop area first");
      return;
    }

    if (!livePreviewUrl) {
      alert("Preview is still loading. Please wait a moment and try again.");
      return;
    }

    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      console.log("✓ Crop successful:", {
        fileName: croppedImage.name,
        fileType: croppedImage.type,
        fileSize: croppedImage.size,
        dimensions: previewDimensions ? `${previewDimensions.width}×${previewDimensions.height}px` : "calculated",
      });
      onCropComplete(croppedImage);
    } catch (e) {
      console.error("✗ Error cropping image:", e);
      alert("Failed to crop image: " + (e instanceof Error ? e.message : "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4">
          <h3 className="text-lg font-bold text-white">Crop Your Photo</h3>
          <p className="text-blue-100 text-sm mt-1">
            Adjust the image size and position as needed
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Crop Container */}
          <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden" style={{ height: "400px" }}>
            <ReactEasyCrop
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              cropShape="rect"
              showGrid
              onCropChange={onCropChange}
              onCropComplete={onCropAreaComplete}
              onZoomChange={setZoom}
            />
          </div>

          {/* Zoom Slider */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Zoom: {(zoom * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Drag to move • Scroll to zoom • Use slider to adjust
            </p>
          </div>

          {/* Preview */}
          <div className="flex items-center justify-center gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Original</p>
              <div className="border-2 border-blue-400 rounded-lg p-1 bg-white dark:bg-gray-700">
                {imageSrc && (
                  <div
                    className="relative bg-gray-200 dark:bg-gray-600 rounded"
                    style={{
                      width: "100px",
                      height: "100px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={imageSrc}
                      alt="Original"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="text-gray-500 dark:text-gray-400">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Preview {previewDimensions ? `(${previewDimensions.width}×${previewDimensions.height})` : ""}
              </p>
              <div className="border-2 border-green-400 rounded-lg p-1 bg-white dark:bg-gray-700 flex items-center justify-center" style={{ minWidth: "120px", minHeight: "120px" }}>
                {livePreviewUrl ? (
                  <img
                    src={livePreviewUrl}
                    alt="Cropped Preview"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div className="text-gray-400 text-xs text-center">Loading...</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex gap-3 justify-end border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCropSubmit}
            disabled={isProcessing}
            className="px-6 py-2 bg-linear-to-r from-green-600 to-green-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Use This Photo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
