// import Lottie from "lottie-react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import loadingPlane from "public/lotties/loading-plane.json";
import loadingFile from "public/lotties/loading-files.json";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect, useState } from "react";

// https://lottiereact.com/
// https://lottiefiles.com/99297-loading-files
// https://lottiefiles.com/9844-loading-40-paperplane

const Loading: React.FC = () => {
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);
  // if (typeof window !== "undefined") {
  //   injectStyle();
  // }

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  const style = {
    height: 500,
  };

  if (typeof document !== "undefined") {
    return (
      <div className="flex flex-col items-center justify-center" ref={parent}>
        {/* <Lottie animationData={loadingPlane as unknown} style={style} /> */}
        {/* <Player autoplay loop src={loadingPlane} style={style}>
          <Controls
            visible={false}
            buttons={["play", "repeat", "frame", "debug"]}
          />
        </Player> */}
        <h3 className="text-3xl"> Getting your data ...</h3>
      </div>
    );
  }
};

export default Loading;
