"use client";

import { useState, useEffect } from "react";
import Loader from "@/components/Loader";
import ShopkeeperScene from "@/components/ShopkeeperScene";

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false);

  useEffect(() => {
    // If she's been here before this session (e.g. returning from /paid), skip the loader
    if (sessionStorage.getItem("loaderSeen")) {
      setLoaderDone(true);
    }
  }, []);

  function handleLoaderComplete() {
    sessionStorage.setItem("loaderSeen", "1");
    setLoaderDone(true);
  }

  return (
    <main style={{ width: "100%", height: "100dvh", overflow: "hidden", position: "relative" }}>
      {loaderDone && <ShopkeeperScene />}
      {!loaderDone && <Loader onComplete={handleLoaderComplete} />}
    </main>
  );
}
