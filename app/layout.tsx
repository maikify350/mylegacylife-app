import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Sans-serif font for UI (Inter)
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Serif font for content (Playfair Display)
const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MyLegacyLife.AI - Preserve Your Stories for Future Generations",
  description: "Share your life's memories through voice and stories. Create a beautiful hardcover book for your family with weekly prompts and AI assistance.",
  keywords: ["legacy", "memories", "storytelling", "family history", "voice recording", "memoir"],
  authors: [{ name: "MyLegacyLife.AI" }],
  creator: "MyLegacyLife.AI",
  publisher: "MyLegacyLife.AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Accessibility
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5, // Allow zoom up to 500% for accessibility
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#1F2937" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>

        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
