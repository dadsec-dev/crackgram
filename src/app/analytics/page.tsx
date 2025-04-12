"use client";

import { useState } from "react";
import Link from "next/link";

export default function AnalyticsDashboard() {
  const [gaLink, setGaLink] = useState("https://analytics.google.com/");
  
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-gray-50">
      <header className="w-full max-w-5xl mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent pb-2">
            Analytics Dashboard
          </h1>
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to App
          </Link>
        </div>
        <p className="text-gray-600 max-w-2xl mt-2">
          Monitor user engagement and track how people are using your AI Image Generator.
        </p>
      </header>

      <div className="w-full max-w-5xl bg-white rounded-xl shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Quick Analytics Overview</h2>
          <p className="text-gray-600">
            For detailed analytics, please visit your <a href={gaLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Analytics Dashboard</a>.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">How to set up Google Analytics</h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Create a Google Analytics account at <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">analytics.google.com</a></li>
            <li>Set up a new property for your website</li>
            <li>Get your Measurement ID (starts with &quot;G-&quot;)</li>
            <li>Replace the placeholder ID in the Analytics.tsx component</li>
            <li>Deploy your application with the updated Measurement ID</li>
            <li>Return to this page and update the link below to your actual Google Analytics dashboard URL</li>
          </ol>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Update Google Analytics Dashboard Link</h3>
          <div className="flex space-x-2">
            <input 
              type="text" 
              value={gaLink}
              onChange={(e) => setGaLink(e.target.value)}
              placeholder="Enter your Google Analytics dashboard URL"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => {
                // Save to localStorage so it persists between sessions
                localStorage.setItem("ga-dashboard-link", gaLink);
                alert("Dashboard link updated!");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mt-8 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Events Being Tracked</h2>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-800">Image Generation</h3>
            <p className="text-sm text-gray-600">Tracks when users generate new images, including dimensions and step count</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-800">Image Viewing</h3>
            <p className="text-sm text-gray-600">Tracks when users view full-size images</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-800">Image Downloads</h3>
            <p className="text-sm text-gray-600">Tracks when users download images and which resolution they choose</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-800">Page Views</h3>
            <p className="text-sm text-gray-600">Automatically tracks page views and navigation</p>
          </div>
        </div>
      </div>
    </main>
  );
} 