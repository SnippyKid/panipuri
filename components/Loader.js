"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./Loader.module.css";

/* ─── Generate SVG cloud-curtain path ─── */
function buildCurtainPath(side) {
  // viewBox 0 0 640 1000
  // Left curtain: solid fill from x=0 to ~550, bumps protrude RIGHT
  // Right curtain: solid fill from x=90 to 640, bumps protrude LEFT

  const bumpSizes = [58, 72, 52, 68, 78, 55, 65, 74, 50, 70, 60, 80];
  const numBumps  = bumpSizes.length;
  const H         = 1000;
  const segH      = H / numBumps;

  if (side === "left") {
    const base = 560;
    let d = `M 0 0 L ${base} 0`;
    for (let i = 0; i < numBumps; i++) {
      const protrude = bumpSizes[i];
      const y1 = i * segH + segH / 2;
      const y2 = (i + 1) * segH;
      d += ` Q ${base + protrude} ${y1} ${base} ${y2}`;
    }
    d += ` L 0 ${H} Z`;
    return d;
  } else {
    const base = 80;
    let d = `M 640 0 L ${base} 0`;
    for (let i = 0; i < numBumps; i++) {
      const protrude = bumpSizes[i];
      const y1 = i * segH + segH / 2;
      const y2 = (i + 1) * segH;
      d += ` Q ${base - protrude} ${y1} ${base} ${y2}`;
    }
    d += ` L 640 ${H} Z`;
    return d;
  }
}

function Curtain({ side, forwardRef }) {
  const path = buildCurtainPath(side);
  return (
    <div
      ref={forwardRef}
      className={`${styles.curtain} ${side === "left" ? styles.curtainLeft : styles.curtainRight}`}
    >
      <svg
        viewBox="0 0 640 1000"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        {/* Slight drop shadow on the bump edge */}
        <defs>
          <filter id={`shadow-${side}`} x="-10%" y="-5%" width="130%" height="110%">
            <feDropShadow
              dx={side === "left" ? 6 : -6}
              dy="0"
              stdDeviation="8"
              floodColor="#00000022"
            />
          </filter>
        </defs>
        <path
          d={path}
          fill="white"
          filter={`url(#shadow-${side})`}
        />
        {/* Subtle inner cream tint at bottom of curtain for depth */}
        <path d={path} fill="url(#curtainGrad)" opacity="0.18" />
        <defs>
          <linearGradient id="curtainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ─── Main Loader ─── */
export default function Loader({ onComplete }) {
  const loaderRef      = useRef(null);
  const leftRef        = useRef(null);
  const rightRef       = useRef(null);
  const progressRef    = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    const counter = { val: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      /* Phase 1 — curtains slide IN from left & right */
      tl.to(leftRef.current, {
        x: 0,
        duration: 1.15,
        ease: "power3.inOut",
      }, 0);

      tl.to(rightRef.current, {
        x: 0,
        duration: 1.15,
        ease: "power3.inOut",
      }, 0);

      /* Phase 2 — loading counter */
      tl.to(counter, {
        val: 100,
        duration: 1.7,
        ease: "power1.inOut",
        onUpdate() {
          const v = Math.round(counter.val);
          if (progressRef.current)    progressRef.current.textContent = v + "%";
          if (progressBarRef.current) progressBarRef.current.firstElementChild.style.width = v + "%";
        },
      }, "-=0.3");

      /* Phase 3 — curtains EXIT left & right */
      tl.to(leftRef.current, {
        x: "-100%",
        duration: 1.25,
        ease: "power4.inOut",
      }, "+=0.3");

      tl.to(rightRef.current, {
        x: "100%",
        duration: 1.25,
        ease: "power4.inOut",
      }, "<");

      /* Phase 4 — fade out loader shell */
      tl.to(loader, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
          loader.style.display = "none";
          onComplete?.();
        },
      }, "-=0.2");
    }, loader);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={loaderRef} className={styles.loader}>
      {/* Warm sky peek between the curtains */}
      <div className={styles.loaderBg} />

      <Curtain side="left"  forwardRef={leftRef}  />
      <Curtain side="right" forwardRef={rightRef} />

      {/* Loading label + progress — sits above curtains in the center gap */}
      <div className={styles.centerContent}>
        <p className={styles.loadingLabel}>✨ Loading the magic</p>
        <div className={styles.progressBar} ref={progressBarRef}>
          <div className={styles.progressFill} />
        </div>
        <p ref={progressRef} className={styles.progressNum}>0%</p>
      </div>
    </div>
  );
}
