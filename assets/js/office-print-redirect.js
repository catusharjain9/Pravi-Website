(() => {
  "use strict";
  const status = document.getElementById("status");
  const hint = document.getElementById("hint");
  const retry = document.getElementById("retry");
  const recordUrl = "https://raw.githubusercontent.com/catusharjain9/Pravi-Website/office-print-state/office-print-url.json";
  let busy = false;

  async function connect() {
    if (busy) return;
    busy = true;
    retry.hidden = true;
    status.textContent = "Checking the latest office connection…";
    try {
      const response = await fetch(recordUrl + "?v=" + Date.now(), {
        cache: "no-store",
        credentials: "omit"
      });
      if (!response.ok) throw new Error("The connection record could not be reached.");
      const record = await response.json();
      if (!record || typeof record.url !== "string" || !record.url.trim()) {
        throw new Error("The office printer connection is not currently published. Turn on the office PC and wait for its tunnel to start.");
      }
      const candidate = new URL(record.url);
      const validHost = /^[a-z0-9-]+\.trycloudflare\.com$/i.test(candidate.hostname);
      if (candidate.protocol !== "https:" || !validHost || candidate.hostname.toLowerCase() === "api.trycloudflare.com") {
        throw new Error("The office printer connection is not currently published.");
      }
      status.textContent = "Office connection found. Opening the print portal…";
      hint.textContent = "You will be taken to the printer's secure sign-in page.";
      window.location.replace(candidate.origin + "/login");
    } catch (error) {
      status.textContent = error && error.message
        ? error.message
        : "The office printer PC is not reachable yet.";
      hint.textContent = "Check that the printer PC is on and the Office Print services are running. Then try again.";
      retry.hidden = false;
    } finally {
      busy = false;
    }
  }

  retry.addEventListener("click", connect);
  connect();
})();
