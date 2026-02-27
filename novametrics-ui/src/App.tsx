import { useEffect, useState, useRef } from "react";
import mqtt from "mqtt";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

interface SensorData {
  lampotila: number;
  aikaleima: string;
}

const App = () => {
  const [history, setHistory] = useState<SensorData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<mqtt.MqttClient | null>(null);

  const url = import.meta.env.VITE_MQTT_BROKER_URL || "wss://://broker.hivemq.com";
  const topic = import.meta.env.VITE_MQTT_TOPIC || "novametrics/projekti/2026/testi";
  const renderUrl = import.meta.env.VITE_RENDER_BACKEND_URL || "";

  useEffect(() => {
    // Backendin herätys
    if (renderUrl) {
      fetch(renderUrl, { mode: 'no-cors' }).catch(() => {});
    }

    if (clientRef.current) return;

    const options = {
      clientId: "nova_ui_" + Math.random().toString(16).substring(2, 10),
      keepalive: 30, // Lähettää pingin 30s välein
      reconnectPeriod: 2000, // Yrittää uudelleen nopeasti jos katkeaa
      connectTimeout: 30 * 1000,
      clean: true,
    };

    const client = mqtt.connect(url, options);
    clientRef.current = client;

    client.on("connect", () => {
      console.log("✅ MQTT Yhteys OK!");
      setIsConnected(true);
      client.subscribe(topic);
    });

    client.on("message", (t, msg) => {
      if (t === topic) {
        try {
          const data: SensorData = JSON.parse(msg.toString());
          setHistory((prev) => [...prev, data].slice(-20));
          setIsConnected(true);
        } catch (e) {
          console.error("❌ Parsintavirhe:", e);
        }
      }
    });

    // Tunnistetaan yhteyden katkeaminen (esim. selaimen säästötila)
    client.on("close", () => setIsConnected(false));
    client.on("offline", () => setIsConnected(false));
    client.on("error", (err) => {
      if (err.message !== "client disconnecting") setIsConnected(false);
    });

    // Pakotetaan uudelleenkytkentä kun välilehti aktivoidaan
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (clientRef.current && !clientRef.current.connected) {
          console.log("🔄 Välilehti aktivoitu, yhdistetään MQTT uudelleen...");
          clientRef.current.reconnect();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (clientRef.current) {
        clientRef.current.end(false);
        clientRef.current = null;
      }
    };
  }, [url, topic, renderUrl]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter text-blue-500">NovaMetrics</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Real-time IoT Dashboard</p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
              <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
              <span className="text-xs font-mono uppercase font-bold">{isConnected ? "Live" : "Reconnecting..."}</span>
            </div>
          </div>

          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-8 md:pb-0">
              <span className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Lämpötila</span>
              <div className="text-8xl font-black text-slate-900 leading-none tracking-tighter tabular-nums">
                {history.length > 0 ? history[history.length - 1].lampotila : "--"}
                <span className="text-blue-500 text-5xl">°</span>
              </div>
              <p className="text-slate-400 text-sm mt-4 italic">
                {history.length > 0 ? `Päivitys: ${history[history.length - 1].aikaleima}` : "Odotetaan dataa..."}
              </p>
            </div>

            <div className="md:col-span-2 h-64 bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-inner">
              <Line
                data={{
                  labels: history.map(d => d.aikaleima),
                  datasets: [{
                    label: "Lämpötila",
                    data: history.map(d => d.lampotila),
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { grid: { color: "#f1f5f9" } }, x: { grid: { display: false } } }
                }}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 py-8 px-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            <p>NovaMetrics @2026 Heikki Törmänen</p>
          </div>
          <div className="text-xs font-bold bg-blue-50 text-blue-600 px-4 py-2 rounded-full border border-blue-100 uppercase">
            STATUS: {isConnected ? "OPERATIONAL" : "RECONNECTING"}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;