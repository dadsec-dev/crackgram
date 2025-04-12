import "./globals.css";
import { Analytics } from "@/components/Analytics";
import Script from "next/script";

// Separate viewport export as recommended by Next.js
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "Crackgram | AI Image Generation Platform",
  description: "Transform your ideas into stunning visuals with Crackgram. Create professional-quality AI-generated images using Google Imagen and Ideogram models. Free to try, easy to use.",
  keywords: "AI image generation, Crackgram, AI art, text-to-image, Ideogram, Google Imagen, AI visuals, image creator, AI image maker, AI art generator, AI image generator, AI art tool, AI design tool",
  creator: "Chidera Onwuatu",
  metadataBase: new URL("https://crackgram.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Crackgram | Create Professional AI Images Instantly",
    description: "Transform text prompts into stunning visuals with Crackgram. Powered by Google Imagen and Ideogram AI models.",
    url: "https://crackgram.com",
    siteName: "Crackgram",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "Crackgram - AI Image Generation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crackgram | Create Stunning AI Images",
    description: "Transform text into professional-quality visuals with our powerful AI platform",
    images: ["/twitter-image.jpg"],
    creator: "@ChideraOnwuatu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // Replace with actual verification code when available
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body>
        {children}
        <Analytics />
        <Script id="schema-structured-data" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Crackgram",
              "url": "https://crackgram.com",
              "description": "Transform your ideas into stunning visuals with Crackgram. Create professional-quality AI-generated images using Google Imagen and Ideogram models.",
              "applicationCategory": "DesignApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Person",
                "name": "Chidera Onwuatu",
                "email": "secdad1@gmail.com"
              }
            }
          `}
        </Script>
      </body>
    </html>
  );
}
