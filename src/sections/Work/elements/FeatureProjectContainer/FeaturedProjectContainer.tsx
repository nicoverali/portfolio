import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef, type PropsWithChildren } from "react";
import Styles from "./FeaturedProjectContainer.module.scss";

const FeaturedProjectContainer: React.FC<PropsWithChildren> = (props) => {
  const containerRef = useRef(null);
  useGSAP(
    () => {
      gsap.from(".container .info, .container .images", {
        y: 24,
        opacity: 0,
        duration: 1,
        ease: "back.out(3)",
        scrollTrigger: {
          trigger: ".container",
          start: "top center",
          // markers: true,
        },
        stagger: 0.3,
      });
    },
    { scope: containerRef }
  );

  return (
    <div className={Styles.container} ref={containerRef}>
      {props.children}
    </div>
  );
};

export default FeaturedProjectContainer;
