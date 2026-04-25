'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Ad {
  id: number;
  company: { company_name: string };
  image_url: string;
  link_url: string;
}

export function AdCarousel() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';
  const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? 'http://127.0.0.1:8000/storage';

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch(`${API_URL}/ads/approved`);
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setAds(data.data);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [ads.length]);

  if (loading || ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  const goToSlide = (index: number) => {
    setCurrentIndex(index % ads.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-[1280px] mx-auto">
        <div className="relative">
          {/* Ad Container */}
          <div className="relative overflow-hidden rounded-lg shadow-lg bg-black">
            {/* Current Ad */}
            <a
              href={currentAd.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <img
                src={`${STORAGE_URL}/${currentAd.image_url}`}
                alt={currentAd.company.company_name}
                className="w-full aspect-[4/1] object-cover group-hover:opacity-90 transition-opacity"
              />
            </a>

            {/* Previous Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Next Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Company Info */}
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Featured by: <span className="font-semibold text-foreground">{currentAd.company.company_name}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {currentIndex + 1} of {ads.length}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
