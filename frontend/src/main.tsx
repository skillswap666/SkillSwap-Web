
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// importing custom css
import "./index.css";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(<App />);
  