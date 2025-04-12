"use client";

import { useState } from "react";
import Image from "next/image";
import { GeneratedImageType, formatDate } from "@/lib/utils";
import { trackEvent } from "./Analytics";

interface GeneratedImageProps {
  image: GeneratedImageType;
  showDetails?: boolean;
}

export function GeneratedImage({ image, showDetails = true }: GeneratedImageProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Function to download the image
  const downloadImage = async (url: string, size: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `crackgram-${image.id.slice(0, 8)}-${size}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      trackEvent("download_image", "image_interaction", `Downloaded ${size} image: ${image.id.slice(0, 8)}`);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  // Validate image URL before rendering
  const isValidImageUrl = image.url && typeof image.url === 'string' && image.url.startsWith('http');
  
  if (!isValidImageUrl) {
    console.error("Invalid image URL:", image.url);
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="aspect-square bg-gray-200 flex items-center justify-center">
          <div className="text-gray-500 text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Image URL is invalid</p>
          </div>
        </div>
        {showDetails && (
          <div className="p-4">
            <p className="text-sm text-gray-600 line-clamp-2">{image.prompt}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Image preview */}
        <div 
          className="relative aspect-square cursor-pointer" 
          onClick={() => {
            if (!imageLoadError) {
              setIsImageModalOpen(true);
              trackEvent("view_full_image", "image_interaction", `Viewed image: ${image.id.slice(0, 8)}`)
            }
          }}
        >
          {imageLoadError ? (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-gray-500 text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Failed to load image</p>
              </div>
            </div>
          ) : (
            <>
              <Image
                src={image.url}
                alt={image.prompt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                onError={() => setImageLoadError(true)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                <span className="sr-only">View full size</span>
              </div>
            </>
          )}
        </div>

        {/* Details section */}
        {showDetails && (
          <div className="p-4 space-y-3">
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900 text-sm">Prompt</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{image.prompt}</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-gray-500">
                {formatDate(new Date(image.createdAt))}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsInfoModalOpen(true)}
                  className="p-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                  title="View details"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="sr-only">Info</span>
                </button>
                {!imageLoadError && (
                  <button
                    onClick={() => downloadImage(image.url, `${image.width}x${image.height}`)}
                    className="p-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                    title="Download image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="sr-only">Download</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full image modal */}
      {isImageModalOpen && !imageLoadError && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
            <div className="relative aspect-square max-h-[80vh] max-w-full">
              <Image
                src={image.url}
                alt={image.prompt}
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
                onError={() => {
                  setImageLoadError(true);
                  setIsImageModalOpen(false);
                }}
              />
            </div>
            <div className="bg-white rounded-b-lg p-4 flex justify-between items-center">
              <p className="text-gray-700 text-sm truncate max-w-[70%]">{image.prompt}</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => downloadImage(image.url, "original")}
                  className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Image info modal */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">Crackgram Image Details</h3>
                <button
                  onClick={() => setIsInfoModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="sr-only">Close</span>
                </button>
              </div>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Prompt</h4>
                  <p className="mt-1 text-sm text-gray-900">{image.prompt}</p>
                </div>
                
                {image.negativePrompt && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Negative Prompt</h4>
                    <p className="mt-1 text-sm text-gray-900">{image.negativePrompt}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Generation Settings</h4>
                  <ul className="mt-1 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <li>
                      <span className="text-gray-500">Dimensions:</span>{" "}
                      <span className="text-gray-900">{image.width}×{image.height}</span>
                    </li>
                    <li>
                      <span className="text-gray-500">Steps:</span>{" "}
                      <span className="text-gray-900">{image.steps}</span>
                    </li>
                    <li>
                      <span className="text-gray-500">Guidance Scale:</span>{" "}
                      <span className="text-gray-900">{image.guidanceScale}</span>
                    </li>
                    <li>
                      <span className="text-gray-500">Scheduler:</span>{" "}
                      <span className="text-gray-900">{image.scheduler}</span>
                    </li>
                    <li>
                      <span className="text-gray-500">Created:</span>{" "}
                      <span className="text-gray-900">{formatDate(new Date(image.createdAt))}</span>
                    </li>
                    <li>
                      <span className="text-gray-500">Model:</span>{" "}
                      <span className="text-gray-900">
                        {image.modelVersion === "ideogram-ai/ideogram-v2-turbo" 
                          ? "Ideogram v2 Turbo" 
                          : image.modelVersion === "google/imagen-3" 
                            ? "Google Imagen 3" 
                            : image.modelVersion}
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div className="pt-2">
                  <button
                    onClick={() => downloadImage(image.url, `${image.width}x${image.height}`)}
                    className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 