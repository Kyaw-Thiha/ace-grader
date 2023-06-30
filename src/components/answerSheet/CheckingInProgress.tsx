import Lottie from "lottie-react";
import writingOnNotebook from "public/lotties/writing-on-notebook.json";
import { useAutoAnimate } from "@formkit/auto-animate/react";

// https://lottiereact.com/
// https://lottiefiles.com/99297-loading-files
// https://lottiefiles.com/9844-loading-40-paperplane

const CheckingInProgress: React.FC = () => {
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);

  const style = {
    height: 500,
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-2"
      ref={parent}
    >
      <h2 className="text-3xl"> Checking in Progress </h2>
      <Lottie animationData={writingOnNotebook as unknown} style={style} />
      <h3 className="text-xl">Refresh this page in a few minutes</h3>
    </div>
  );
};

export default CheckingInProgress;
