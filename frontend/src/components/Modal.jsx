import { useEffect } from "react";
import Button from "./Button";
  

const Modal = ({ children, onClose }) => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="h-screen fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
      <div className="rounded-lg shadow-lg w-full max-w-xl relative p-10">
        <Button
          onClick={onClose}
          className="absolute text-sm font-semibold top-0 right-0 text-blue-600 hover:underline cursor-pointer"
        >
          ← Go Back
        </Button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
