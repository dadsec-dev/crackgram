"use client";

import { useState, useEffect } from "react";
import { clearSavedImages, getSavedImages } from "@/lib/utils";
import Image from "next/image";
import { ImageGenerator } from "@/components/ImageGenerator";
import { GeneratedImage } from "@/components/GeneratedImage";
import { ImageGallery } from "@/components/ImageGallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm" role="banner">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-indigo-600" aria-label="Crackgram - Home">Crackgram</Link>
          <nav className="flex space-x-4" role="navigation" aria-label="Main Navigation">
            <Link href="/generate" className="text-gray-600 hover:text-indigo-600">Create</Link>
            <Link href="/generate?tab=gallery" className="text-gray-600 hover:text-indigo-600">Gallery</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-16 pb-16 sm:pt-24 sm:pb-24" aria-labelledby="hero-heading">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="text-left">
              <h1 id="hero-heading" className="text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl mb-6">
                Your Ideas, <span className="text-indigo-600">Visualized</span> Instantly
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mb-8">
                Crackgram transforms your text into stunning visuals using advanced AI models from Ideogram and Google. No design skills required.
              </p>
              <Link 
                href="/generate" 
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg"
                aria-label="Create your first AI-generated image"
              >
                Create Your First Image
              </Link>
            </div>
            <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/img1.png"
                alt="AI generated artwork example by Crackgram"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">State-of-the-Art AI Models</h2>
              <p className="text-gray-600">
                Access premium models including Ideogram v2 Turbo and Google Imagen 3 without subscription fees
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Pro-Level Controls</h2>
              <p className="text-gray-600">
                Fine-tune your creations with professional parameters that give you complete creative control
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Lightning-Fast Results</h2>
              <p className="text-gray-600">
                Generate professional images in seconds - perfect for marketing, social media, and creative projects
              </p>
            </div>
          </div>
        </section>

        {/* Sample Gallery */}
        <section className="bg-white py-16" aria-labelledby="gallery-heading">
          <div className="container mx-auto px-4">
            <h2 id="gallery-heading" className="text-3xl font-bold text-center text-gray-900 mb-4">What Our Users Are Creating</h2>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              From marketing materials to social media content, Crackgram helps thousands of creators bring their ideas to life
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Sample Image Cards - Using actual sample images */}
              <article className="bg-gray-100 rounded-xl overflow-hidden shadow-md">
                <div className="aspect-square relative">
                  <Image
                    src="/img1.png"
                    alt="Crackgram AI generated image - Fantasy landscape"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm truncate">
                    A fantasy landscape with vibrant colors and floating islands
                  </p>
                </div>
              </article>
              
              <article className="bg-gray-100 rounded-xl overflow-hidden shadow-md">
                <div className="aspect-square relative">
                  <Image
                    src="/img2.png"
                    alt="Crackgram AI generated image - Futuristic portrait"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm truncate">
                    Photorealistic portrait of a futuristic cyborg explorer
                  </p>
                </div>
              </article>
              
              <article className="bg-gray-100 rounded-xl overflow-hidden shadow-md">
                <div className="aspect-square relative">
                  <Image
                    src="/img33.png"
                    alt="Crackgram AI generated image - Cyberpunk style"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm truncate">
                    Abstract geometric patterns in a neon cyberpunk style
                  </p>
                </div>
              </article>
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/generate" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md"
                aria-label="Start creating AI-generated images now"
              >
                Start Creating Now
              </Link>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-gray-50" aria-labelledby="process-heading">
          <div className="container mx-auto px-4">
            <h2 id="process-heading" className="text-3xl font-bold text-center text-gray-900 mb-12">Simple 3-Step Process</h2>
            
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative h-80 lg:h-[400px] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/img2.png"
                  alt="Crackgram AI image generation process"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent"></div>
              </div>
              
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-indigo-600">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Describe What You Want</h3>
                    <p className="text-gray-600">
                      Enter a detailed prompt describing your ideal image – the more specific, the better
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-indigo-600">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Choose Your Options</h3>
                    <p className="text-gray-600">
                      Select your preferred AI model and adjust professional-grade settings for perfect results
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-indigo-600">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Download & Use</h3>
                    <p className="text-gray-600">
                      Get your high-quality image in seconds, ready to download and use in your projects
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="relative py-20 overflow-hidden" aria-labelledby="cta-heading">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/img33.png"
              alt="Crackgram AI generated background"
              fill
              className="object-cover"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-700/90"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 id="cta-heading" className="text-3xl font-bold text-white mb-4">Ready to Transform Your Ideas into Images?</h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of creatives, marketers, and entrepreneurs already using Crackgram to bring their ideas to life
            </p>
            <Link 
              href="/generate" 
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 transition-colors shadow-lg"
              aria-label="Try Crackgram free now"
            >
              Try Crackgram Free
            </Link>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t" role="contentinfo">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h2 className="font-bold text-lg text-gray-800 mb-4">Crackgram</h2>
              <p className="text-gray-600 text-sm">
                The easiest way to create professional AI-generated images for any project.
              </p>
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-800 mb-4">Contact</h2>
              <p className="text-gray-600 text-sm">
                Questions or feedback? Email us at<br />
                <a href="mailto:secdad1@gmail.com" className="text-indigo-600 hover:underline">secdad1@gmail.com</a>
              </p>
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-800 mb-4">Legal</h2>
              <p className="text-gray-600 text-sm">
                By using Crackgram, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600 text-sm">
              Powered by Next.js, Replicate API, and state-of-the-art AI models
            </p>
            <p className="text-gray-500 text-xs mt-2">
              © {new Date().getFullYear()} Crackgram by Chidera Onwuatu. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
