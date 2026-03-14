"use client";

import { useState } from "react";
import Loader from "@/components/Loader";
import ShopkeeperScene from "@/components/ShopkeeperScene";

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false);

  return (
    <main style={{ width: "100%", height: "100dvh", overflow: "hidden", position: "relative" }}>
      {loaderDone && <ShopkeeperScene />}
      <Loader onComplete={() => setLoaderDone(true)} />
    </main>
  );
}
