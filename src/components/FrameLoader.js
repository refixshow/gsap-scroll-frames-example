/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, forwardRef } from "react";

const currentFrame = (index, src) =>
  `${src}${index.toString().padStart(4, "0")}.jpg`;

const FrameLoader = forwardRef(
  ({ state, setIsLoading, setEndOfFrames }, canvas) => {
    useEffect(() => {
      const preloadImages = () => {
        for (let i = 1; i < state.frameCount; i++) {
          const img = new Image();
          img.src = currentFrame(i, state.src);

          if (i === state.frameCount - 1) {
            img.onload = () => setIsLoading(false);
          }
        }
      };

      preloadImages();
    }, []);

    useEffect(() => {
      if (!canvas.current) return;
      if (state.isLoading) return;

      const cn = canvas.current;
      const cx = cn.getContext("2d");

      cn.width = 1158;
      cn.height = 770;

      const html = document.documentElement;
      const img = new Image();
      img.src = currentFrame(1, state.src);
      img.onload = function () {
        cx.drawImage(img, 0, 0);
      };

      const updateImage = (index) => {
        img.src = currentFrame(index, state.src);
        cx.drawImage(img, 0, 0);

        if (index === state.frameCount) {
          setEndOfFrames(true);
          return;
        }
        if (state.isEndOfFrames) {
          setEndOfFrames(false);
          return;
        }
      };

      const updateFrame = () => {
        const scrollTop = html.scrollTop;
        const maxScrollTop = html.scrollHeight - window.innerHeight;
        const scrollFraction = scrollTop / maxScrollTop;
        const frameIndex = Math.min(
          state.frameCount - 1,
          Math.ceil(scrollFraction * state.frameCount)
        );

        requestAnimationFrame(() => updateImage(frameIndex + 1));
      };

      window.addEventListener("scroll", updateFrame);

      updateFrame();

      return () => window.removeEventListener("scroll", updateFrame);
    }, [state.isLoading, state.isEndOfFrames]);

    return <canvas ref={canvas}></canvas>;
  }
);

export default FrameLoader;
