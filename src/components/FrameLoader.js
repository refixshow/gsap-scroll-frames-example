/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, forwardRef, useState } from "react";

const currentFrame = (index, src) =>
  `${src}${index.toString().padStart(4, "0")}.jpg`;

const html = document.documentElement;

const FrameLoader = forwardRef(
  ({ state, setIsLoading, setEndOfFrames }, canvas) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
      const preloadImages = () => {
        const imgtemp = [];
        for (let i = 1; i < state.frameCount; i++) {
          const img = new Image();
          img.src = currentFrame(i, state.src);

          imgtemp.push(img);

          if (i === state.frameCount - 1) {
            img.onload = () => setIsLoading(false);
            setImages(imgtemp);
          }
        }
      };

      preloadImages();
    }, []);

    useEffect(() => {
      if (!canvas.current) return;
      if (state.isLoading) return;
      if (images.length === 0) return;

      const cn = canvas.current;
      const cx = cn.getContext("2d");

      cn.width = 1158;
      cn.height = 770;

      cx.drawImage(images[0], 0, 0);

      const updateImage = (index) => {
        cx.drawImage(images[index + 1], 0, 0);

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
        const maxScrollTop = html.clientHeight;
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
    }, [state.isLoading, state.isEndOfFrames, images]);

    return <canvas className="opacity" ref={canvas}></canvas>;
  }
);

export default FrameLoader;
