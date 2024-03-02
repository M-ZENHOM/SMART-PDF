import { type ClassValue, clsx } from "clsx"
import { Metadata } from "next";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatTime(timeStr: string): string {
  const timeObj: Date = new Date(timeStr);
  const year: number = timeObj.getUTCFullYear();
  const month: string = timeObj.toLocaleString('en-us', { month: 'short' });
  return `${year} ${month}`;
}


export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}${path}`
  return `http://localhost:${process.env.PORT ?? 3000
    }${path}`
}


export function constructMetadata({
  title = "Smart PDF - your fresh confidant.",
  description = "Smart PDF is an open-source software to make chatting to your PDF files easy.",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@MAD_ZENHOM"
    },
    icons,
    metadataBase: new URL('https://smart-friend-pdf.vercel.app'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  }
}