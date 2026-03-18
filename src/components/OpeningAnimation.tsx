import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const SEEN_KEY = 'oro-opening-seen';

const OpeningAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) {
      setSkip(true);
      onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem(SEEN_KEY, '1');
        onComplete();
      },
    });

    // Phase 1: Logo fade in
    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }
    );

    // Phase 2: Glow pulse
    tl.fromTo(
      glowRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1.5, duration: 0.6, ease: 'power2.out' },
      '-=0.2'
    );

    // Phase 3: Split and slide away
    tl.to(
      topRef.current,
      {
        clipPath: 'polygon(0% 0%, 0% 0%, 0% 0%)',
        duration: 1,
        ease: 'power3.inOut',
      },
      '+=0.3'
    );
    tl.to(
      bottomRef.current,
      {
        clipPath: 'polygon(100% 100%, 100% 100%, 100% 100%)',
        duration: 1,
        ease: 'power3.inOut',
      },
      '<'
    );

    // Glow expands and fades
    tl.to(
      glowRef.current,
      { opacity: 0, scale: 3, duration: 0.8, ease: 'power2.in' },
      '<+=0.2'
    );

    // Logo fades out
    tl.to(logoRef.current, { opacity: 0, duration: 0.4 }, '<');

    // Container fades
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        if (containerRef.current) containerRef.current.style.display = 'none';
      },
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (skip) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{ perspective: '1000px' }}
    >
      {/* Top-left shard */}
      <div
        ref={topRef}
        className="absolute inset-0"
        style={{
          clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)',
          background:
            'linear-gradient(135deg, hsl(240 10% 8% / 0.95) 0%, hsl(240 15% 12% / 0.9) 50%, hsl(43 72% 52% / 0.1) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        }}
      />

      {/* Bottom-right shard */}
      <div
        ref={bottomRef}
        className="absolute inset-0"
        style={{
          clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%)',
          background:
            'linear-gradient(315deg, hsl(240 10% 6% / 0.95) 0%, hsl(240 12% 10% / 0.9) 50%, hsl(43 72% 52% / 0.1) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        }}
      />

      {/* Diagonal glow seam */}
      <div
        ref={glowRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: 0 }}
      >
        <div
          className="w-[200vmax] h-[3px]"
          style={{
            transform: 'rotate(-45deg)',
            background:
              'linear-gradient(90deg, transparent 0%, hsl(43 72% 52% / 0) 20%, hsl(43 72% 52% / 0.8) 45%, hsl(43 90% 70% / 1) 50%, hsl(43 72% 52% / 0.8) 55%, hsl(43 72% 52% / 0) 80%, transparent 100%)',
            boxShadow:
              '0 0 40px 10px hsl(43 72% 52% / 0.3), 0 0 80px 20px hsl(43 72% 52% / 0.15)',
          }}
        />
      </div>

      {/* Logo / brand reveal */}
      <div
        ref={logoRef}
        className="absolute inset-0 flex flex-col items-center justify-center gap-3"
        style={{ opacity: 0 }}
      >
        <span className="font-display text-5xl font-semibold tracking-tight text-brand-eggshell">
          ORO
        </span>
        <span className="text-xs font-sans uppercase tracking-[0.4em] text-brand-gold">
          Menú Digital
        </span>
      </div>
    </div>
  );
};

export default OpeningAnimation;
