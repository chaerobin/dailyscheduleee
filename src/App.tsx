import { useEffect } from "react";
import { SchedulePage } from "./SchedulePage";

function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }
}

function App() {
  useEffect(() => {
    registerSW();
  }, []);

  return <SchedulePage />;
}

export default App;
