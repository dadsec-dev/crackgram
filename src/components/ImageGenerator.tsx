"use client";

import { useState, FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { GeneratedImageType, saveImageToStorage } from "@/lib/utils";
import { GeneratedImage } from "@/components/GeneratedImage";
import { trackEvent } from "./Analytics";

// Define the form data structure
interface FormData {
  prompt: string;
  negativePrompt: string;
  steps: number;
  guidanceScale: number;
  width: number;
  height: number;
  scheduler: string;
  model: string;
}

export function ImageGenerator() {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    prompt: "",
    negativePrompt: "",
    steps: 50,
    guidanceScale: 7.5,
    width: 512,
    height: 512,
    scheduler: "DPMSolverMultistep",
    model: "ideogram-ai/ideogram-v2-turbo",
  });

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImageType | null>(null);
  const [debugInfo, setDebugInfo] = useState<{requestModel: string, responseModel: string} | null>(null);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "steps" || name === "guidanceScale" || name === "width" || name === "height" 
        ? parseFloat(value) 
        : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (isGenerating) return;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    setProgress(0);

    try {
      setProgress(10);
      
      // Shorter timeout to match Vercel limits
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 55000); // 55 seconds timeout (just under Vercel's limit)
      
      setProgress(20);
      console.log("Sending API request with data:", formData);
      
      // Improve loading messages to set better expectations
      const loadingMessages = [
        "Initializing AI model...",
        "Interpreting your prompt...",
        "Creating your image...",
        "This may take up to a minute...",
        "If timeout occurs, try with a simpler prompt or fewer steps",
        "Consider using 512x512 resolution for faster generation"
      ];
      
      let messageIndex = 0;
      const messageInterval = setInterval(() => {
        if (messageIndex < loadingMessages.length) {
          setError(loadingMessages[messageIndex]);
          messageIndex++;
        }
      }, 7000);
      
      // Adaptive progress for longer operations
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          // Only increase progress up to 90% while waiting
          if (prev < 90) {
            return prev + (90 - prev) / 10;
          }
          return prev;
        });
      }, 2000);
      
      const response = await fetch("/api/replicate/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      setError(null);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setProgress(90);
      
      // Log detailed information about the API response and model selection
      console.log("API request model:", formData.model);
      console.log("API response:", data);
      
      if (!data.output) {
        throw new Error("No output was received from the API");
      }

      // Handle different possible output formats
      let imageUrl;
      if (Array.isArray(data.output) && data.output.length > 0) {
        imageUrl = data.output[0];
      } else if (typeof data.output === 'string') {
        imageUrl = data.output;
      } else if (data.output && typeof data.output === 'object') {
        // Try to find an image URL in any of the common property names
        console.log("Output is an object:", data.output);
        
        const possibleUrlProps = ['image', 'url', 'output', 'generated_image'];
        for (const prop of possibleUrlProps) {
          if (data.output[prop] && typeof data.output[prop] === 'string' && data.output[prop].startsWith('http')) {
            imageUrl = data.output[prop];
            break;
          }
        }
        
        // If we still don't have a URL, try to check if the output itself is the URL
        if (!imageUrl && typeof data.output === 'string' && data.output.startsWith('http')) {
          imageUrl = data.output;
        }
      } else {
        console.error("Unexpected output format:", data.output);
        throw new Error("Unexpected output format from the API");
      }

      if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
        console.error("Invalid image URL:", imageUrl);
        throw new Error("Invalid image URL returned from the API");
      }

      // Use the model that was actually used by the API if available, otherwise fall back to the requested model
      const modelVersion = data.modelUsed || formData.model;
      console.log("Using model version for image data:", modelVersion);
      
      // Update debug info with the model actually used
      setDebugInfo({
        requestModel: formData.model,
        responseModel: data.modelUsed || formData.model
      });
      
      // Create image data object
      const imageData: GeneratedImageType = {
        id: uuidv4(),
        url: imageUrl,
        prompt: formData.prompt,
        negativePrompt: formData.negativePrompt,
        modelVersion: modelVersion, // Use the model that was actually used
        createdAt: new Date().toISOString(),
        width: formData.width,
        height: formData.height,
        steps: formData.steps,
        guidanceScale: formData.guidanceScale,
        scheduler: formData.scheduler,
      };

      // Save to localStorage
      saveImageToStorage(imageData);
      
      // Update state
      setGeneratedImage(imageData);
      setProgress(100);

      // Track event
      trackEvent(
        "generate_image", 
        "image_generation", 
        `Generated ${formData.width}x${formData.height} image`,
        formData.steps
      );
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError(
          "The request timed out. Vercel's free tier has a 60-second limit for serverless functions. Try the following:" +
          "\n1. Use a simpler prompt" + 
          "\n2. Reduce the number of inference steps (20-30 is often sufficient)" +
          "\n3. Use 512x512 resolution" +
          "\n4. Try again (server load varies)"
        );
      } else if (err instanceof Error && err.message.includes('504')) {
        setError(
          "Gateway Timeout (504). The server took too long to respond. Try the following:" +
          "\n1. Use a simpler prompt" + 
          "\n2. Reduce the number of inference steps (20-30 is often sufficient)" +
          "\n3. Use 512x512 resolution" +
          "\n4. Try again (server load varies)"
        );
      } else {
        setError(err instanceof Error ? err.message : "An error occurred during image generation");
      }
      console.error("Error generating image:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form section */}
      <div className="w-full">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
              Prompt <span className="text-red-500">*</span>
            </label>
            <textarea
              id="prompt"
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              placeholder="Describe your image in detail (e.g., subject, style, mood, setting, colors)..."
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="negativePrompt" className="block text-sm font-medium text-gray-700">
              Negative Prompt
            </label>
            <textarea
              id="negativePrompt"
              name="negativePrompt"
              value={formData.negativePrompt}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              placeholder="Elements to exclude from your image (e.g., blurry, low quality, distorted faces)..."
            />
          </div>

          {/* Advanced options section */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Advanced Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label htmlFor="model" className="block text-xs font-medium text-gray-700">
                  AI Model
                </label>
                <select
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900"
                >
                  <option value="ideogram-ai/ideogram-v2-turbo">Ideogram v2 Turbo</option>
                  <option value="google/imagen-3">Google Imagen 3</option>
                  <option disabled value="">More models coming soon...</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="steps" className="block text-xs font-medium text-gray-700">
                  Inference Steps ({formData.steps})
                </label>
                <input
                  type="range"
                  id="steps"
                  name="steps"
                  value={formData.steps}
                  onChange={handleChange}
                  min="20"
                  max="80"
                  step="1"
                  className="w-full text-gray-900"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="guidanceScale" className="block text-xs font-medium text-gray-700">
                  Guidance Scale ({formData.guidanceScale})
                </label>
                <input
                  type="range"
                  id="guidanceScale"
                  name="guidanceScale"
                  value={formData.guidanceScale}
                  onChange={handleChange}
                  min="1"
                  max="15"
                  step="0.1"
                  className="w-full text-gray-900"
                />
              </div>
              
              <div className="space-y-1">
                <label htmlFor="width" className="block text-xs font-medium text-gray-700">
                  Width
                </label>
                <select
                  id="width"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900"
                >
                  <option value={512}>512px</option>
                  <option value={768}>768px</option>
                  <option value={1024}>1024px</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="height" className="block text-xs font-medium text-gray-700">
                  Height
                </label>
                <select
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900"
                >
                  <option value={512}>512px</option>
                  <option value={768}>768px</option>
                  <option value={1024}>1024px</option>
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label htmlFor="scheduler" className="block text-xs font-medium text-gray-700">
                  Scheduler
                </label>
                <select
                  id="scheduler"
                  name="scheduler"
                  value={formData.scheduler}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900"
                >
                  <option value="DPMSolverMultistep">DPMSolverMultistep</option>
                  <option value="DDIM">DDIM</option>
                  <option value="K_EULER">K_EULER</option>
                  <option value="K_EULER_ANCESTRAL">K_EULER_ANCESTRAL</option>
                  <option value="PNDM">PNDM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Display error if there is one */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error.split('\n').map((line, idx) => (
                <p key={idx} className={idx > 0 ? "mt-1" : ""}>{line}</p>
              ))}
            </div>
          )}

          {/* Generate button */}
          <button
            type="submit"
            disabled={isGenerating}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${isGenerating ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating your image... {progress > 0 ? `${progress}%` : ""}
              </>
            ) : "Generate with Crackgram"}
          </button>

          {/* Basic usage instructions */}
          <div className="text-xs text-gray-500 mt-2">
            <p>For best results, be specific about details, style, lighting, and composition. 
              The more descriptive your prompt, the better your results.</p>
          </div>
        </form>
      </div>

      {/* Generated image section */}
      <div className="w-full">
        {generatedImage ? (
          <GeneratedImage image={generatedImage} />
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col items-center justify-center">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Your Crackgram Image</h3>
              <p className="text-gray-500 max-w-md">
                Your generated image will appear here. Create professional-quality visuals with just a few words.
              </p>
              {isGenerating && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 