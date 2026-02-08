const statusEl = document.getElementById("status");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const showBtn = document.getElementById("show");
const clearBtn = document.getElementById("clear");
const heatmapContainer = document.getElementById("heatmap-container");

const HEATMAP_SECONDS = 45;
const gazePoints = [];
let capturing = false;
let captureTimer = null;
let countdownTimer = null;
let heatmap = null;
let samplingTimer = null;
let lastMouse = null;

function setStatus(message) {
  statusEl.textContent = `Estado: ${message}`;
}

function initHeatmap() {
  if (!heatmap) {
    heatmap = h337.create({
      container: heatmapContainer,
      radius: 35,
      maxOpacity: 0.6,
      blur: 0.9
    });
  }
}

function stopCapture(reason) {
  capturing = false;
  if (captureTimer) {
    clearTimeout(captureTimer);
    captureTimer = null;
  }
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
  if (samplingTimer) {
    clearInterval(samplingTimer);
    samplingTimer = null;
  }
  startBtn.disabled = false;
  stopBtn.disabled = true;
  showBtn.disabled = gazePoints.length === 0;
  showBtn.style.display = "inline-flex";
  clearBtn.disabled = gazePoints.length === 0;
  setStatus(reason);
}

function normalizePoint(data) {
  if (!data) return null;
  const x = Math.max(0, Math.min(window.innerWidth, Math.round(data.x)));
  const y = Math.max(0, Math.min(window.innerHeight, Math.round(data.y)));
  return { x, y, value: 1 };
}

function startCapture() {
  gazePoints.length = 0;
  capturing = true;
  webgazer.resume();
  startBtn.disabled = true;
  stopBtn.disabled = false;
  showBtn.disabled = true;
  showBtn.style.display = "none";
  clearBtn.disabled = true;
  let remaining = HEATMAP_SECONDS;
  setStatus(`capturando... ${remaining}s`);

  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
      return;
    }
    setStatus(`capturando... ${remaining}s`);
  }, 1000);

  if (samplingTimer) clearInterval(samplingTimer);
  samplingTimer = setInterval(() => {
    if (!capturing) return;
    const data = webgazer.getCurrentPrediction();
    let point = normalizePoint(data);
    if (!point && lastMouse) {
      point = { x: lastMouse.x, y: lastMouse.y, value: 0.2 };
    }
    if (point) gazePoints.push(point);
  }, 100);

  captureTimer = setTimeout(() => {
    stopCapture("captura finalizada");
  }, HEATMAP_SECONDS * 1000);
}

function showHeatmap() {
  initHeatmap();
  if (gazePoints.length === 0) {
    setStatus("no hay puntos capturados");
    return;
  }
  heatmapContainer.style.display = "block";
  const data = {
    max: 10,
    data: gazePoints
  };
  heatmap.setData(data);
  setStatus("mapa de calor generado");
}

function clearHeatmap() {
  initHeatmap();
  heatmap.setData({ max: 1, data: [] });
  heatmapContainer.style.display = "none";
  setStatus("mapa de calor limpiado");
}

startBtn.addEventListener("click", startCapture);
stopBtn.addEventListener("click", () => stopCapture("captura detenida"));
showBtn.addEventListener("click", showHeatmap);
clearBtn.addEventListener("click", clearHeatmap);

document.addEventListener("mousemove", (event) => {
  lastMouse = { x: event.clientX, y: event.clientY };
});

window.addEventListener("load", async () => {
  initHeatmap();
  setStatus("inicializando WebGazer...");
  startBtn.disabled = true;

  try {
    // Use the classic tracker to avoid face_mesh asset 404s.
    webgazer.setTracker("clmtrackr");
    await webgazer
      .setGazeListener((data) => {
        if (!capturing) return;
        const point = normalizePoint(data);
        if (point) gazePoints.push(point);
      })
      .begin();
  } catch (err) {
    setStatus("error al iniciar WebGazer");
    return;
  }

  webgazer.showVideo(true);
  webgazer.showFaceOverlay(true);
  webgazer.showFaceFeedbackBox(true);
  webgazer.showPredictionPoints(true);
  webgazer.resume();

  // Some environments never resolve readiness; enable after a short delay.
  setTimeout(() => {
    startBtn.disabled = false;
    setStatus("listo para capturar");
  }, 1500);

  // Fallback: some builds don't expose isReady reliably.
  if (typeof webgazer.isReady === "function") {
    const readyCheck = setInterval(() => {
      if (webgazer.isReady()) {
        clearInterval(readyCheck);
        startBtn.disabled = false;
        setStatus("listo para capturar");
      }
    }, 300);
  }
});
