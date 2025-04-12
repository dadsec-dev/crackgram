"use client";

import { useState, useEffect } from "react";
import { GeneratedImageType, getSavedImages } from "@/lib/utils";
import { GeneratedImage } from "./GeneratedImage";

export function ImageGallery() {
  const [images, setImages] = useState<GeneratedImageType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const imagesPerPage = 8;

  // Load images from localStorage
  useEffect(() => {
    try {
      setIsLoading(true);
      const savedImages = getSavedImages();
      
      // Filter out any images with invalid URLs
      const validImages = savedImages.filter(img => 
        img && 
        img.url && 
        typeof img.url === 'string' && 
        img.url.startsWith('http')
      );
      
      // Log any issues found with saved images
      if (validImages.length < savedImages.length) {
        console.warn(`Filtered out ${savedImages.length - validImages.length} images with invalid URLs`);
      }
      
      setImages(validImages);
    } catch (error) {
      console.error("Error loading saved images:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Calculate pagination values
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const currentImages = images.slice(startIndex, endIndex);

  // Handle page changes
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // If there are no saved images
  if (!isLoading && images.length === 0) {
    return (
      <div className="w-full text-center py-16 px-4">
        <div className="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No images yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Generate some images to see them in your gallery. All your creations will be saved here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentImages.map((image) => (
              <GeneratedImage key={image.id} image={image} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-6">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="sr-only">Previous</span>
                </button>

                <div className="flex items-center">
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === currentPage;
                    
                    // Show ellipsis for large page counts
                    if (totalPages > 7) {
                      // Always show first, last, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-3 py-1 rounded-md ${
                              isCurrentPage
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                      // Show ellipsis when there's a gap
                      if (
                        (page === 2 && currentPage > 3) ||
                        (page === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <span key={page} className="px-2 py-1 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                    
                    // For fewer pages, show all
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 rounded-md ${
                          isCurrentPage
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="sr-only">Next</span>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
} 