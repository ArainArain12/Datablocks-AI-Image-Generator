import { useEffect, useRef } from "react";
import lottie from "lottie-web";

export default function LoadingAnimation() {
  const animationContainer = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const animationInstance = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/lottie/loading.json",
      });
      return () => {
        animationInstance?.destroy();
      };
    }
  }, []);

  return (
    <div
      ref={animationContainer}
      style={{
        width: "250px",
        height: "250px",
        justifyItems: "center",
        alignItems: "center",
      }}
    ></div>
  );
}
