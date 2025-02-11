import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

const Toast = (type: "success" | "error", message: any) => {
  if (type === "success") {
    return toast.success(message, toastOptions);
  } else if (type === "error") {
    return toast.error(`Error: ${message}`, toastOptions);
  }
};

const ToastBox = () => {
  return (
    <ToastContainer
      className="z-50"
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export { Toast, ToastBox };
