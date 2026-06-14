import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if (!window.location.hash) {
  window.location.hash = "#/";
}

createRoot(document.getElementById("root")!).render(<App />);

// PWA service worker registration — guarded so it is a no-op in sandboxed
// previews and insecure contexts, and only runs for real static hosting.
if (
  "serviceWorker" in navigator &&
  window.isSecureContext &&
  window.location.protocol === "https:"
) {
  window.addEventListener("load", () => {
    const swUrl = new URL("sw.js", document.baseURI).toString();
    navigator.serviceWorker.register(swUrl).catch(() => {
      // Ignore: registration may be blocked in sandboxed iframes.
    });
  });
}
