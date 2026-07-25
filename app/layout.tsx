import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const title = "AGI / Vector — Frontier Intelligence Map";
  const description =
    "An immersive timeline for tracking AI breakthroughs, live frontier signals, and transparent AGI forecast scenarios.";
  const image = new URL("/og.png", base).toString();

  return {
    metadataBase: base,
    title,
    description,
    applicationName: "AGI / Vector",
    keywords: ["AGI tracker", "AI timeline", "AI research", "forecast model"],
    openGraph: {
      type: "website",
      siteName: "AGI / Vector",
      title,
      description,
      url: base,
      images: [{ url: image, width: 1536, height: 1024, alt: "AGI Vector intelligence corridor" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}