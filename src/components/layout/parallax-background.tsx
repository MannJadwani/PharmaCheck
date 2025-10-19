'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

type ParallaxBackgroundProps = {
  scrollContainerId?: string;
};

export function ParallaxBackground({ scrollContainerId }: ParallaxBackgroundProps) {
  const layerSlowRef = useRef<HTMLDivElement>(null);
  const layerMidRef = useRef<SVGSVGElement>(null);
  const layerImagesRef = useRef<HTMLDivElement>(null);
  const layerFastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerId
      ? (document.getElementById(scrollContainerId) as HTMLElement | null)
      : null;
    const scrollTarget: HTMLElement | Window = container ?? window;
    let rafId = 0;
    let latestY = 0;

    const update = () => {
      const slow = layerSlowRef.current;
      const mid = layerMidRef.current;
      const imgs = layerImagesRef.current;
      const fast = layerFastRef.current;
      if (slow) slow.style.transform = `translate3d(0, ${latestY * 0.15}px, 0)`;
      if (mid) mid.style.transform = `translate3d(0, ${latestY * 0.3}px, 0)`;
      if (imgs) imgs.style.transform = `translate3d(0, ${latestY * 0.4}px, 0)`;
      if (fast) fast.style.transform = `translate3d(0, ${latestY * 0.6}px, 0)`;
    };

    const onScroll = () => {
      latestY = container ? container.scrollTop : window.scrollY;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          update();
          rafId = 0;
        });
      }
    };

    const targetEl: any = scrollTarget;
    targetEl.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      targetEl.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [scrollContainerId]);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Layer 1: big soft gradient blob (slow) */}
      <div
        ref={layerSlowRef}
        className="absolute left-1/2 top-[-20%] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 50%, rgba(165,180,252,0.35) 0%, rgba(216,180,254,0.25) 40%, rgba(191,219,254,0.25) 100%)',
        }}
      />

      {/* Layer 2: subtle grid (mid) */}
      <svg
        ref={layerMidRef}
        aria-hidden
        className="absolute inset-x-0 top-0 h-[1200px] w-full stroke-gray-200/70"
      >
        <defs>
          <pattern id="pg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pg-grid)" />
      </svg>

      {/* Layer 2.5: branded/background images (mid-fast) */}
      <div ref={layerImagesRef} className="absolute inset-0">
        {/* Use local public assets to avoid external config */}
        <Image
          src="/globe.svg"
          alt="Globe"
          width={220}
          height={220}
          className="absolute left-[6%] top-[18%] opacity-20 grayscale"
          priority
        />
        <Image
          src="/window.svg"
          alt="UI Window"
          width={260}
          height={200}
          className="absolute right-[8%] top-[28%] opacity-20 grayscale rotate-3"
          priority
        />
        <Image
          src="/file.svg"
          alt="File"
          width={180}
          height={180}
          className="absolute left-[12%] bottom-[20%] opacity-20 grayscale -rotate-2"
          priority
        />
        <Image
          src="/next.svg"
          alt="Next"
          width={200}
          height={80}
          className="absolute right-[14%] bottom-[26%] opacity-10 grayscale"
          priority
        />
      </div>

      {/* Layer 3: small floating chips (fast) */}
      <div ref={layerFastRef} className="absolute inset-0">
        <div className="absolute left-[8%] top-[20%] h-10 w-28 rotate-3 rounded-xl border border-gray-200 bg-white/80 shadow-md backdrop-blur-sm" />
        <div className="absolute right-[10%] top-[35%] h-8 w-24 -rotate-2 rounded-xl border border-gray-200 bg-white/80 shadow-md backdrop-blur-sm" />
        <div className="absolute left-[15%] bottom-[18%] h-12 w-32 rotate-2 rounded-xl border border-gray-200 bg-white/80 shadow-md backdrop-blur-sm" />
        <div className="absolute right-[18%] bottom-[22%] h-8 w-20 rotate-6 rounded-xl border border-gray-200 bg-white/80 shadow-md backdrop-blur-sm" />
      </div>
    </div>
  );
}


