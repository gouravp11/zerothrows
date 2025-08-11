import { useState } from "react";

export default function Button({ children, onClick, className = "", ...props }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    if (!onClick) return;
    const result = onClick(e);

    // Detect async function
    if (result instanceof Promise) {
      setLoading(true);
      try {
        await result;
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 rounded bg-blue-600 text-white 
                  hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed 
                  flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}