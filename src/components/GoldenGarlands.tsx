import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Subtle golden garland strands that sway with GSAP.
 * Rendered as SVG paths with parallax-aware positioning.
 */
const strands = [
  { d: 'M0,0 Q40,60 80,20 T160,30 T240,10 T320,35', x: '5%', delay: 0 },
  { d: 'M0,10 Q50,50 100,15 T200,40 T300,20', x: '30%', delay: 0.4 },
  { d: 'M0,5 Q30,45 70,10 T140,35 T210,15 T280,30', x: '55%', delay: 0.8 },
  { d: 'M0,0 Q45,55 90,18 T180,38 T270,12', x: '75%', delay: 1.2 },
];

const GoldenGarlands = () => {
  const svgRefs = useRef<(SVGSVGElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anims: gsap.core.Tween[] = [];

    svgRefs.current.forEach((svg, i) => {
      if (!svg) return;
      const strand = strands[i];
      const tween = gsap.to(svg, {
        rotation: 1.5,
        transformOrigin: `${50 + i * 5}% 0%`,
        duration: 3 + i * 0.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: strand.delay,
      });
      anims.push(tween);
    });

    // Parallax on scroll
    const handleScroll = () => {
      if (!containerRef.current) return;
      const y = window.scrollY * 0.15;
      containerRef.current.style.transform = `translateY(${y}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      anims.forEach((t) => t.kill());
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed top-0 left-0 right-0 z-0 h-48 overflow-hidden"
      aria-hidden
    >
      {strands.map((strand, i) => (
        <svg
          key={i}
          ref={(el) => { svgRefs.current[i] = el; }}
          className="absolute top-0"
          style={{ left: strand.x, width: '320px', height: '80px' }}
          viewBox="0 0 320 60"
          fill="none"
        >
          <path
            d={strand.d}
            stroke="hsl(43 72% 52% / 0.18)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Light dots along strand */}
          {[0.15, 0.4, 0.65, 0.9].map((t, j) => (
            <circle
              key={j}
              cx={320 * t}
              cy={15 + Math.sin(t * Math.PI) * 20}
              r="2"
              fill="hsl(43 72% 52% / 0.3)"
            >
              <animate
                attributeName="opacity"
                values="0.2;0.6;0.2"
                dur={`${2 + j * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>
      ))}
      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, hsl(var(--background) / 0) 0%, hsl(var(--background)) 100%)',
        }}
      />
    </div>
  );
};

export default GoldenGarlands;
