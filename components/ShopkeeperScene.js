"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import QRCode from "react-qr-code";
import styles from "./ShopkeeperScene.module.css";

/* ──────────────────────────────────────────────────────────
   🔗  PASTE YOUR HOSTED /paid PAGE URL HERE WHEN READY
   ────────────────────────────────────────────────────────── */
const QR_TARGET_URL = "https://YOUR_HOSTED_URL_HERE/paid";

/* ─── Typewriter hook ─── */
function useTypewriter(text, speed = 36) {
  const [chars, setChars] = useState(0);

  useEffect(() => {
    setChars(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setChars(i);
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return { displayed: text.slice(0, chars), done: chars >= text.length };
}

/* ─── Dialogue script ─── */
const SCRIPT = [
  { text: "Aye aye! Welcome welcome, madam! 🙏", delay: 0 },
  { text: "Yahan aana hua... toh kuch toh lena padega! 😏", delay: 2800 },
  { text: "Toh batao... WANNA EAT SOME SPICY PANI PURI? 🤤🌶️", delay: 5800, buttons: true },
];

const NO_REPLIES = [
  "WHAT?! BILKUL GALAT JAWAB! 😤 Phir socho...",
  "Yaar seriously?? Itna tasty hai fir bhi?? 🥺",
  "OKAY FINE. Bhukhi raho. 😤 (please eat it tho 🙏)",
];

const YES_REPLY  = "WOWWW!! Smart girl! 🎉 Pehle pay kar do toh! 💸";

/* ─── QR Card ─── */
function QRCard() {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 80, opacity: 0, scale: 0.85 },
      { y: 0,  opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.6)" }
    );
  }, []);

  return (
    <div ref={cardRef} className={styles.qrCard}>
      <p className={styles.qrHeading}>Scan karo & pay karo! 📱</p>
      <div className={styles.qrBox}>
        <QRCode
          value={QR_TARGET_URL}
          size={180}
          fgColor="#7C2D12"
          bgColor="#FEF9EE"
          style={{ borderRadius: 8 }}
        />
      </div>
      <p className={styles.qrSub}>UPI • PhonePe • GPay — sab chalega 😄</p>
    </div>
  );
}

/* ─── Main component ─── */
export default function ShopkeeperScene() {
  const [stepText,   setStepText]   = useState(SCRIPT[0].text);
  const [showBtns,   setShowBtns]   = useState(false);
  const [noCount,    setNoCount]    = useState(0);
  const [showQR,     setShowQR]     = useState(false);
  const [answered,   setAnswered]   = useState(false);

  const sceneRef  = useRef(null);
  const keeperRef = useRef(null);
  const bubbleRef = useRef(null);
  const btnsRef   = useRef(null);

  const { displayed, done } = useTypewriter(stepText);

  /* Entry animations */
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(keeperRef.current,
      { x: -260, opacity: 0 },
      { x: 0,    opacity: 1, duration: 1.0, ease: "power3.out" }
    );
    tl.fromTo(bubbleRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.7)" },
      "-=0.2"
    );

    /* Auto-advance dialogue */
    const timers = SCRIPT.slice(1).map((s) =>
      setTimeout(() => {
        changeBubble(s.text, s.buttons ?? false);
      }, s.delay)
    );

    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Show buttons only once typing is done */
  useEffect(() => {
    if (done && showBtns && !answered) {
      if (btnsRef.current) {
        gsap.fromTo(btnsRef.current,
          { y: 20, opacity: 0 },
          { y: 0,  opacity: 1, duration: 0.4, ease: "back.out(1.5)" }
        );
      }
    }
  }, [done, showBtns, answered]);

  function changeBubble(text, withBtns = false) {
    setShowBtns(false);
    gsap.to(bubbleRef.current, {
      scale: 0.88, opacity: 0, duration: 0.18,
      onComplete: () => {
        setStepText(text);
        if (withBtns) setShowBtns(true);
        gsap.fromTo(bubbleRef.current,
          { scale: 0.88, opacity: 0 },
          { scale: 1,    opacity: 1, duration: 0.42, ease: "back.out(1.7)" }
        );
      },
    });
  }

  function handleYes() {
    setAnswered(true);
    setShowBtns(false);
    changeBubble(YES_REPLY);

    const qrDelay = YES_REPLY.length * 36 + 600;
    setTimeout(() => {
      setShowQR(true);
      // Follow-up bubble after QR appears
      setTimeout(() => {
        changeBubble("Payment kia? Madamji? 👀😏");
        setTimeout(() => {
          changeBubble("Jaldi karo... puri thandi ho jaayegi! 😤🌶️");
        }, 4200);
      }, 2000);
    }, qrDelay);
  }

  function handleNo() {
    const msg = NO_REPLIES[Math.min(noCount, NO_REPLIES.length - 1)];
    setNoCount((c) => c + 1);
    changeBubble(msg, true);
  }

  return (
    <div ref={sceneRef} className={styles.scene}>
      {/* Atmospheric dark bg */}
      <div className={styles.bg} />
      {/* Bokeh lights */}
      {[...Array(9)].map((_, i) => (
        <div key={i} className={styles.bokeh} style={{ "--i": i }} />
      ))}

      {/* Shopkeeper figure */}
      <div ref={keeperRef} className={styles.keeperWrap}>
        <div className={styles.keeperGlow} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/shopkeeper.jpg"
          alt="Pani Puri Wala"
          className={styles.keeperImg}
        />
      </div>

      {/* Speech bubble */}
      <div ref={bubbleRef} className={styles.bubbleWrap}>
        <div className={styles.bubble}>
          <span className={styles.bubbleText}>
            {displayed}
            {!done && <span className={styles.cursor} />}
          </span>

          {showBtns && done && (
            <div ref={btnsRef} className={styles.btnRow}>
              <button className={styles.btnYes} onClick={handleYes}>
                HAAAN! 🤤
              </button>
              <button className={styles.btnNo} onClick={handleNo}>
                Nahi 😑
              </button>
            </div>
          )}
        </div>
        <div className={styles.bubbleTail} />
      </div>

      {/* QR code */}
      {showQR && <QRCard />}
    </div>
  );
}
