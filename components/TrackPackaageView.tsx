'use client';
import { useEffect } from 'react';
import { trackPageView } from '@/lib/analytics';
import { usePathname } from 'next/navigation';

export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView({
      page_title: document.title,
      page_location: window.location.href,
      page_path: pathname,
    });
  }, [pathname]);

  return null;
}
