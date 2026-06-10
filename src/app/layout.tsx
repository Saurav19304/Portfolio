import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import { getSeoSettings } from "@/lib/db";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://saurav.digital"),
  title: {
    default: "Saurav Vaghela | Digital Marketing & SEO Specialist",
    template: "%s | Saurav Vaghela",
  },
  description: "Portfolio of Saurav Vaghela, a Digital Marketing and SEO professional specializing in keyword research, technical SEO, and data-driven strategies to improve search rankings and organic traffic.",
  keywords: [
    "Saurav Vaghela",
    "Digital Marketing Specialist",
    "SEO Specialist",
    "Technical SEO",
    "Keyword Research",
    "SEO Consultant",
    "Data-Driven Marketing Specialist",
    "Digital Marketing Portfolio",
    "Saurav Digital"
  ],
  authors: [{ name: "Saurav Vaghela", url: "https://saurav.digital" }],
  creator: "Saurav Vaghela",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://saurav.digital/",
    title: "Saurav Vaghela | Digital Marketing & SEO Specialist",
    description: "Portfolio of Saurav Vaghela, a Digital Marketing and SEO professional specializing in keyword research, technical SEO, and data-driven strategies to improve search rankings and organic traffic.",
    siteName: "Saurav Vaghela Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Saurav Vaghela | Digital Marketing & SEO Specialist Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saurav Vaghela | Digital Marketing & SEO Specialist",
    description: "Portfolio of Saurav Vaghela, a Digital Marketing and SEO professional specializing in keyword research, technical SEO, and data-driven strategies to improve search rankings and organic traffic.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://saurav.digital/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seo = await getSeoSettings();
  const gaId = seo?.general?.googleAnalyticsId || "G-ZXXGPSHTHY";
  const googleSiteVerification = seo?.general?.googleSiteVerification || "";
  const schemaMarkup = seo?.general?.schemaMarkup || "";

  return (
    <html lang="en">
      <head>
        {/* Google Site Verification */}
        {googleSiteVerification && (
          <meta name="google-site-verification" content={googleSiteVerification} />
        )}

        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}

        {/* Dynamic Schema Markup */}
        {schemaMarkup && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: schemaMarkup }}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}

