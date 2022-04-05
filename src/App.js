import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import gsap from "gsap";

import FrameLoader from "./components/FrameLoader";

const frameCount = 137;
const src =
  "https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/";

const useHandleFrameLoader = () => {
  const [state, setState] = useState({
    isLoading: true,
    isEndOfFrames: false,
    frameCount,
    src,
  });

  const setIsLoading = useCallback((isLoading) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setEndOfFrames = useCallback((isEndOfFrames) => {
    setState((prev) => ({ ...prev, isEndOfFrames }));
  }, []);

  return { state, setIsLoading, setEndOfFrames };
};

function App() {
  const ref = useRef(null);
  const text = useRef(null);
  const frameHandler = useHandleFrameLoader();

  useEffect(() => {
    if (frameHandler.state.isLoading) return;

    gsap.fromTo(
      ref.current,
      { opacity: 0 },
      { opacity: 1, duration: 2, ease: "easeOutExpo" }
    );
    gsap.fromTo(
      text.current,
      { opacity: 0 },
      { opacity: 1, delay: 1, duration: 2, ease: "easeOutExpo" }
    );
  }, [frameHandler.state.isLoading]);

  return (
    <div className="container">
      <section>
        <header></header>
      </section>
      <section>
        <FrameLoader
          ref={ref}
          state={frameHandler.state}
          setIsLoading={frameHandler.setIsLoading}
          setEndOfFrames={frameHandler.setEndOfFrames}
        />
        <div className="text" ref={text}>
          <h1>AirPods Pro</h1>
        </div>
      </section>
    </div>
  );
}

export default App;
