"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ImageGenerator } from "@/components/ImageGenerator";
import { ImageGallery } from "@/components/ImageGallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSavedImages, clearSavedImages } from "@/lib/utils";

// Inner component that uses useSearchParams
function GeneratePageContent() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const initialTab = tabFromUrl === 'gallery' ? 'gallery' : 'generate';
  
  const [activeTab, setActiveTab] = useState(initialTab);

  // Check if there are corrupted images in localStorage and clear them if needed
  useEffect(() => {
    try {
      // Try to get saved images
      const savedImages = getSavedImages();
      
      // If we're getting an empty array but there's data in localStorage,
      // it means the data is corrupted and should be cleared
      const rawData = localStorage.getItem("generatedImages");
      if (rawData && savedImages.length === 0) {
        console.warn("Found corrupted image data in localStorage. Clearing...");
        clearSavedImages();
      }
    } catch (error) {
      // If there's an error parsing, clear everything
      console.error("Error checking saved images:", error);
      clearSavedImages();
    }
  }, []);

  return (
    <Tabs defaultValue={initialTab} className="w-full" onValueChange={setActiveTab}>
      <TabsList className="w-full md:w-fit grid grid-cols-2 md:flex md:space-x-2 mb-6">
        <TabsTrigger value="generate">Create Image</TabsTrigger>
        <TabsTrigger value="gallery">My Collection</TabsTrigger>
      </TabsList>
      
      <TabsContent value="generate" className="w-full">
        <ImageGenerator />
      </TabsContent>
      
      <TabsContent value="gallery" className="w-full">
        <ImageGallery />
      </TabsContent>
    </Tabs>
  );
}

export default function GeneratePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-gray-50">
      <header className="w-full max-w-5xl mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-5xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent pb-2">
            Crackgram
          </h1>
          <Link 
            href="/"
            className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Home
          </Link>
        </div>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mt-2">
          Transform your ideas into stunning visuals with our premium AI generation tools
        </p>
      </header>

      <div className="w-full max-w-5xl">
        <Suspense fallback={<div>Loading...</div>}>
          <GeneratePageContent />
        </Suspense>
      </div>
    </main>
  );
} 