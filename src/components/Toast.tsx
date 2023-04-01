import { Slide, ToastContainer } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";

// https://fkhadra.github.io/react-toastify/introduction/
// https://bobbyhadz.com/blog/react-call-function-in-child-component

const Toast: React.FC = () => {
  if (typeof window !== "undefined") {
    injectStyle();
  }

  return (
    <ToastContainer
      position="bottom-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Slide}
    />
  );
};

export default Toast;
