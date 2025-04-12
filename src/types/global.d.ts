// This file contains global type definitions
// Google Analytics gtag function
interface Window {
  gtag: (
    command: string,
    targetId: string,
    config?: Record<string, any> | undefined
  ) => void;
  dataLayer: any[];
} 