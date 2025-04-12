import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to save an image to browser storage
export function saveImageToStorage(imageData: GeneratedImageType) {
  // Validate the image URL before saving
  if (!imageData.url || typeof imageData.url !== 'string' || !imageData.url.startsWith('http')) {
    console.error("Invalid image URL. Not saving to storage:", imageData.url);
    return false;
  }

  try {
    const savedImages = localStorage.getItem("generatedImages");
    let images: GeneratedImageType[] = savedImages ? JSON.parse(savedImages) : [];
    images.unshift(imageData);
    localStorage.setItem("generatedImages", JSON.stringify(images));
    return true;
  } catch (error) {
    console.error("Error saving image to storage:", error);
    return false;
  }
}

// Function to get saved images from browser storage
export function getSavedImages(): GeneratedImageType[] {
  try {
    const savedImages = localStorage.getItem("generatedImages");
    if (!savedImages) return [];
    
    const parsedImages = JSON.parse(savedImages);
    
    // Validate the array and filter out invalid entries
    if (!Array.isArray(parsedImages)) {
      console.error("Saved images is not an array:", parsedImages);
      return [];
    }
    
    // Filter out invalid images
    return parsedImages.filter(img => 
      img && 
      img.url && 
      typeof img.url === 'string' && 
      img.url.startsWith('http')
    );
  } catch (error) {
    console.error("Error getting saved images:", error);
    return [];
  }
}

// Function to clear all saved images (useful for troubleshooting)
export function clearSavedImages(): boolean {
  try {
    localStorage.removeItem("generatedImages");
    return true;
  } catch (error) {
    console.error("Error clearing saved images:", error);
    return false;
  }
}

// Function to format date
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Type definition for generated image data
export interface GeneratedImageType {
  id: string;
  url: string;
  prompt: string;
  negativePrompt?: string;
  modelVersion: string;
  createdAt: string;
  width: number;
  height: number;
  steps: number;
  guidanceScale: number;
  scheduler: string;
} 