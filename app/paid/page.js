"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import styles from "./paid.module.css";

/* ─── Canvas confetti ─── */
function Confetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const COLORS = [
      "#F59E0B","#EF4444","#10B981","#3B82F6",
      "#EC4899","#FCD34D","#34D399","#FB923C","#A78BFA",
    ];

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const pieces = Array.from({ length: 140 }, () => ({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * -window.innerHeight,
      w:     Math.random() * 12 + 5,
      h:     Math.random() * 7  + 3,
      r:     Math.random() * Math.PI * 2,
      dr:    (Math.random() - 0.5) * 0.12,
      vy:    Math.random() * 2.5 + 1.2,
      vx:    (Math.random() - 0.5) * 1.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        // Mix rectangles and circles
        if (p.w > 14) {
          ctx.arc(0, 0, p.w / 3, 0, Math.PI * 2);
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.fill();
        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.r += p.dr;
        if (p.y > canvas.height + 20) {
          p.y  = -20;
          p.x  = Math.random() * canvas.width;
          p.vy = Math.random() * 2.5 + 1.2;
        }
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.confettiCanvas} />;
}

/* ─── Main page ─── */
export default function PaidPage() {
  const router  = useRouter();
  const girlRef = useRef(null);
  const cardRef = useRef(null);
  const btnRef  = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(girlRef.current,
      { y: 60, opacity: 0, scale: 0.9 },
      { y: 0,  opacity: 1, scale: 1, duration: 0.85 }
    )
    .fromTo(cardRef.current,
      { y: 50, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.7 }, "-=0.35"
    )
    .fromTo(btnRef.current,
      { y: 24, opacity: 0, scale: 0.9 },
      { y: 0,  opacity: 1, scale: 1, duration: 0.5 }, "-=0.25"
    );
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <Confetti />

      <div className={styles.layout}>
        {/* Girl photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div ref={girlRef} className={styles.girlWrap}>
          <img
            src="/images/girl.jpg"
            alt="Girlfriend"
            className={styles.girlImg}
          />
          <div className={styles.girlGlow} />
        </div>

        {/* Message card */}
        <div ref={cardRef} className={styles.card}>
          <p className={styles.ufffo}>Uffoooo!! 😂</p>

          <p className={styles.mainMsg}>
            Dumb girl, payment is{" "}
            <span className={styles.highlight}>already done</span>{" "}
            by your BF! ❤️
          </p>

          <p className={styles.hearts}>💛 🧡 ❤️ 💛 🧡</p>

          <p className={styles.sub}>
            Seriously... did you really think<br />
            you&apos;d have to pay? 🥺😭
          </p>

          <button
            ref={btnRef}
            className={styles.backBtn}
            onClick={() => router.push("/")}
          >
            Now go eat your pani puri! 🤤
          </button>
        </div>
      </div>
    </div>
  );
}
