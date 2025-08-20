"use client";
import { useEffect, useRef, useState } from "react";

export default function Halftone404Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const drawRef = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const isIOS = typeof window !== "undefined" && 
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Prevent bounce/overscroll behavior for consistency
  useEffect(() => {
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    
    return () => {
      document.body.style.overscrollBehavior = 'auto';
      document.documentElement.style.overscrollBehavior = 'auto';
    };
  }, []);

  useEffect(() => {
    if (prefersReduced) {
      setReady(true);
      return;
    }

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const v = document.createElement("video");
    videoRef.current = v;

    v.defaultMuted = true;
    v.muted = true;
    v.autoplay = true;
    v.loop = true;
    v.playsInline = true;
    (v as HTMLVideoElement & { playsInline: boolean }).playsInline = true;
    v.crossOrigin = "anonymous";
    v.preload = "auto";

    v.setAttribute("muted", "");
    v.setAttribute("autoplay", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");

    Object.assign(v.style, {
      position: "absolute",
      top: "-9999px",
      left: "-9999px",
      width: "1px",
      height: "1px",
      opacity: "0",
      pointerEvents: "none",
    } as CSSStyleDeclaration);
    document.body.appendChild(v);

    const sizeToVideo = () => {
      if (v.videoWidth && v.videoHeight) {
        canvas.width = v.videoWidth;
        canvas.height = v.videoHeight;
      }
    };

    const grid = 4; // dot spacing (same as original)

    const draw = () => {
      if (!videoRef.current || v.paused || v.ended) {
        requestAnimationFrame(draw);
        return;
      }

      if (canvas.width !== v.videoWidth || canvas.height !== v.videoHeight) {
        sizeToVideo();
      }

      ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = frame.data;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < canvas.height; y += grid) {
        for (let x = 0; x < canvas.width; x += grid) {
          const i = (y * canvas.width + x) * 4;
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const r = (1 - avg / 255) * (grid / 2.5);
          if (r > 0.5) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = "#e5e5e5";
            ctx.fill();
          }
        }
      }

      if (typeof (v as HTMLVideoElement & { requestVideoFrameCallback?: (callback: () => void) => void }).requestVideoFrameCallback === "function") {
        (v as HTMLVideoElement & { requestVideoFrameCallback: (callback: () => void) => void }).requestVideoFrameCallback(() => draw());
      } else {
        requestAnimationFrame(draw);
      }
    };

    drawRef.current = draw;

    const onLoadedMeta = () => sizeToVideo();
    v.addEventListener("loadedmetadata", onLoadedMeta);
    v.addEventListener("loadeddata", onLoadedMeta);

    const attemptPlay = async () => {
      try {
        sizeToVideo();
        await v.play();
        setReady(true);
        drawRef.current();
        return true;
      } catch {
        return false;
      }
    };

    v.src = "/ghost.mp4";
    v.load();

    attemptPlay().then((ok) => {
      if (ok) return;

      const events = ["pointerdown", "keydown", "wheel", "touchstart"];
      const passiveOpts = { passive: true } as AddEventListenerOptions;

      const detach = () => {
        events.forEach((e) => window.removeEventListener(e, kick, passiveOpts));
        document.removeEventListener("visibilitychange", onVisibleTry);
      };

      const kick = async () => {
        if (await attemptPlay()) detach();
      };

      events.forEach((e) => window.addEventListener(e, kick, passiveOpts));

      const onVisibleTry = async () => {
        if (document.visibilityState === "visible" && (await attemptPlay())) {
          detach();
        }
      };
      document.addEventListener("visibilitychange", onVisibleTry);
    });

    // iOS-specific: Simple heartbeat restart
    let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
    
    if (isIOS) {
      let lastTime = Date.now();
      
      heartbeatInterval = setInterval(() => {
        const currentTime = Date.now();
        if (currentTime - lastTime > 3000) {
          // Detected backgrounding - simple restart
          v.currentTime = 0;
          v.play().catch(() => {});
          drawRef.current();
        }
        lastTime = currentTime;
      }, 1000);
    }

    const onVis = () => {
      if (!document.hidden && isIOS) {
        // iOS: always try to restart when becoming visible
        setTimeout(() => {
          v.play().catch(() => {});
          drawRef.current();
        }, 100);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      document.removeEventListener("visibilitychange", onVis);
      v.removeEventListener("loadedmetadata", onLoadedMeta);
      v.removeEventListener("loadeddata", onLoadedMeta);
      try {
        v.pause();
      } catch {}
      v.src = "";
      v.load();
      if (v.parentNode) v.parentNode.removeChild(v);
      videoRef.current = null;
    };
  }, [prefersReduced, isIOS]);

  return (
    <div className={`relative grid place-items-center w-full grow max-h-dvh py-8 md:py-6 transition-opacity duration-700 ease-out ${
      ready ? "opacity-100" : "opacity-0"
    }`}>
      {/* 404 message at top center */}
      {ready && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
          <div className="text-sm opacity-70">
            Get out of here, this page doesn&apos;t exist.
          </div>
        </div>
      )}

      {/* Reserve aspect ratio to prevent layout shift */}
      <div className="relative w-full max-w-[800px]" style={{ aspectRatio: "16 / 9" }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-contain"
          aria-label="Halftone animation"
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}