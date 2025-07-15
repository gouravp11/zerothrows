import { useEffect } from "react";
  

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
        <button
          onClick={onClose}
          className="absolute text-sm font-semibold top-2 right-3 text-blue-600 hover:underline cursor-pointer"
        >
          ← Go Back
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
