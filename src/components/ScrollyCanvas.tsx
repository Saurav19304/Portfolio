"use client";

import { useEffect, useRef } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

import Overlay from "./Overlay";

const FRAME_COUNT = 75;

export default function ScrollyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Track the scroll progress of the 500vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Preload images
  useEffect(() => {
    const preloadImages = () => {
      const loadedImages: HTMLImageElement[] = [];

      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        const indexStr = i.toString().padStart(2, "0");
        img.src = `/sequence/frame_${indexStr}_delay-0.066s.png`;
        loadedImages.push(img);
      }
      imagesRef.current = loadedImages;

      // Draw first frame when the first image loads
      loadedImages[0].onload = () => {
        renderFrame(0);
      };
    };

    preloadImages();
    // window resize handling logic for drawing the canvas correctly
    const handleResize = () => renderFrame(currentFrameIndex.current);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentFrameIndex = useRef<number>(0);

  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete) return;

    // Use object-fit: cover logic for drawing to the canvas
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
        // Canvas is wider than image relative to height
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        // Canvas is taller than image relative to width
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
    }

    // Clear and draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const maxIndex = FRAME_COUNT - 1;
    let nextIndex = Math.round(latest * maxIndex);
    
    // Safety bounds
    if (nextIndex < 0) nextIndex = 0;
    if (nextIndex > maxIndex) nextIndex = maxIndex;

    if (nextIndex !== currentFrameIndex.current) {
        currentFrameIndex.current = nextIndex;
        // Optimization: requestAnimationFrame
        requestAnimationFrame(() => renderFrame(nextIndex));
    }
  });

  // Synchronize canvas dimensions before drawing
  useEffect(() => {
    const updateCanvasSize = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderFrame(currentFrameIndex.current);
        }
    }
    updateCanvasSize();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[500vh] bg-[#121212]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="h-full w-full" />
        <Overlay scrollYProgress={scrollYProgress} />
      </div>
    </section>
  );
}
