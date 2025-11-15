const MODE = import.meta.env.MODE;
export const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL ?? (MODE === "production" ? "" : "http://localhost:8080");
