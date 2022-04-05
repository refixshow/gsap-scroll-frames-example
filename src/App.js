import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import FrameLoader from "./components/FrameLoader";

gsap.registerPlugin(ScrollTrigger);
const frameCount = 138;
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
  const airpods = useRef(null);
  const canvas = useRef(null);
  const storytell = useRef(null);
  const text = useRef(null);
  const frameHandler = useHandleFrameLoader();

  useEffect(() => {
    if (frameHandler.state.isLoading) return;
    if (!canvas.current) return;
    if (!text.current) return;

    gsap.to(canvas.current, { opacity: 1, duration: 2, ease: "easeOutExpo" });
    gsap.to(text.current, {
      opacity: 1,
      delay: 1,
      duration: 2,
      ease: "easeOutExpo",
    });
  }, [frameHandler.state.isLoading]);

  useEffect(() => {
    if (!airpods.current) return;
    if (!canvas.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        scrub: true,
        trigger: airpods.current,
      },
    });

    tl.to(canvas.current, { scale: 0.8 });
  }, []);

  useEffect(() => {
    if (!storytell.current) return;

    [...storytell.current.children].forEach((el) => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: "top",
            end: "bottom",
            scrub: true,
          },
        })
        .fromTo(el, { y: 100, opacity: 0 }, { y: -40, opacity: 1 })
        .to(el, { opacity: 0, y: -80 });
    });
  }, []);

  return (
    <div className="container">
      <section className="airpods" ref={airpods}>
        <FrameLoader
          ref={canvas}
          state={frameHandler.state}
          setIsLoading={frameHandler.setIsLoading}
          setEndOfFrames={frameHandler.setEndOfFrames}
        />
        <div className="text opacity" ref={text}>
          <div>
            <h1>AirPods Pro</h1>
          </div>
        </div>
        <div className="storytell" ref={storytell}>
          <div className="opacity">
            <p>Active Noise Cancellation</p>
            <p>for immersive sound.</p>
          </div>
          <div className="opacity">
            <p>Transparency mode for hearing</p>
            <p>what’s happening around you.</p>
          </div>
          <div className="opacity">
            <p>A customizable fit</p>
            <p>for all-day comfort.</p>
          </div>
          <div className="opacity">
            <p>Magic like you’ve never heard.</p>
          </div>
        </div>
      </section>
      <section className="something"></section>
    </div>
  );
}

export default App;
