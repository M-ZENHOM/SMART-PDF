import { type ClassValue, clsx } from "clsx"
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