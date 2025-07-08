const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
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
