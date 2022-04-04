import "./App.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const generateFrames = (fames) => {
  const output = [];
  let n = 1;
  for (n = 1; n <= fames; n++) {
    let padded = ("0000" + n).slice(-5);
    output.push(padded);

    // call images before initialization for performance
    const img = new Image();
    img.src = `/assets/frames/01/frame_${padded}.jpg`;
  }
  return output;
};

function App() {
  const container = useRef(null);
  const image = useRef(null);
  const content = useRef(null);
  const framesL = useRef(generateFrames(141));

  useEffect(() => {
    if (!container.current) return;
    if (!image.current) return;
    if (!content.current) return;

    const ls = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "+=1500 80%",
        end: "+=1580 20%",
        scrub: true,
      },
    });
    ls.to(content.current, { opacity: 0, y: -80 });

    const ls2 = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "+=3500",
        end: "+=4000",
        scrub: true,
      },
    });
    ls2.to(image.current, { scale: 0.8, y: -500, duration: 0.5 });
    gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "+=1500 50%",
        end: "+=3500",
        scrub: true,
        onEnterBack: () => {
          gsap.set(image.current, {
            attr: {
              src: `/assets/frames/01/frame_${framesL.current[140]}.jpg`,
            },
          });
        },
        onLeaveBack: () => {
          gsap.set(image.current, {
            attr: {
              src: `/assets/frames/01/frame_${framesL.current[0]}.jpg`,
            },
          });
        },
        onLeave: () => {
          gsap.set(image.current, {
            attr: {
              src: `/assets/frames/01/frame_${framesL.current[140]}.jpg`,
            },
          });
        },
        onEnter: () => {
          gsap.set(image.current, {
            attr: {
              src: `/assets/frames/01/frame_${framesL.current[0]}.jpg`,
            },
          });
        },
        onUpdate: (self) => {
          const frames = 141;
          const current = Math.round(self.progress * 100);
          const output = Math.round((frames * current) / 100);

          if (output < 2) return;

          gsap.set(image.current, {
            attr: {
              src: `/assets/frames/01/frame_${framesL.current[output - 1]}.jpg`,
            },
          });
        },
      },
    });
  }, []);

  const sec2 = useRef(null);

  const cta = useRef(null);

  useEffect(() => {
    gsap.set(cta.current, { y: -80, opacity: 0 });

    const ls = gsap.timeline({
      scrollTrigger: {
        trigger: sec2.current,
        start: "-=100",
      },
    });
    ls.to(cta.current, { y: 0, opacity: 1, duration: 0.4 });
  }, []);

  return (
    <div className="container">
      <section className="relative high xd" ref={container}>
        <div className="content" ref={content}>
          <h2>Some sample header</h2>
          <p>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content h
          </p>
          <p>scroll down</p>
        </div>
        <div className="animated-img">
          <img ref={image} src="/assets/frames/01/frame_00001.jpg" alt="cbc" />
        </div>
      </section>
    </div>
  );
}

export default App;
