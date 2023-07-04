import { Slide, type Theme, ToastContainer } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// https://fkhadra.github.io/react-toastify/introduction/
// https://bobbyhadz.com/blog/react-call-function-in-child-component

const Toast: React.FC = () => {
  const { resolvedTheme } = useTheme();
  if (typeof window !== "undefined") {
    injectStyle();
  }

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  return (
    <ToastContainer
      position="bottom-center"
      autoClose={1500}
      hideProgressBar={false}
      newestOnTop={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={resolvedTheme as Theme}
      transition={Slide}
    />
  );
};

export default Toast;
