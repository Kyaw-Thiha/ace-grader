import Lottie from "lottie-react";
import loadingPlane from "@public/lotties/loading-plane.json";
import loadingFile from "@public/lotties/loading-files.json";
import { useAutoAnimate } from "@formkit/auto-animate/react";

// https://lottiereact.com/
// https://lottiefiles.com/99297-loading-files
// https://lottiefiles.com/9844-loading-40-paperplane

const Loading: React.FC = () => {
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);

  const style = {
    height: 500,
  };

  return (
    <div className="flex flex-col items-center justify-center" ref={parent}>
      <Lottie animationData={loadingPlane as unknown} style={style} />
      <h3 className="text-3xl"> Getting your data ...</h3>
    </div>
  );
};

export default Loading;
