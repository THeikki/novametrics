import paho.mqtt.client as mqtt
import json
import time
import random
import threading
import os
from datetime import datetime
from zoneinfo import ZoneInfo
from flask import Flask, jsonify
from flask_cors import CORS

BROKER = os.getenv("MQTT_BROKER", "broker.hivemq.com")
PORT = int(os.getenv("MQTT_PORT", 1883))
TOPIC = os.getenv("MQTT_TOPIC", "novametrics/projekti/2026/testi")

app = Flask(__name__)
# Sallitaan kaikki metodit ja otsikot
CORS(app, resources={r"/*": {
    "origins": "*",
    "methods": ["GET", "OPTIONS"],
    "allow_headers": ["Content-Type"]
}})

@app.route('/')
def health_check():
    return jsonify({
        "status": "ok", 
        "service": "novametrics-backend",
        "timestamp": datetime.now(ZoneInfo("Europe/Helsinki")).isoformat()
    }), 200

def generate_sensordata():
    """Generoi satunnaisluvun ja suomalaisen aikaleiman."""
    temp = random.uniform(20.0, 25.0)
    current_time = datetime.now(ZoneInfo("Europe/Helsinki"))
    return {
        "lampotila": round(temp, 2),
        "aikaleima": current_time.strftime("%H:%M:%S")
    }

# Alustetaan MQTT-asiakas (v2.0 API)
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, "NovaMetrics_Backend_Service")

def run_mqtt_logic():
    """MQTT-logiikka omassa säikeessään."""
    try:
        print(f"🔄 Yhdistetään välittäjään {BROKER} porttiin {PORT}...")
        client.connect(BROKER, PORT, 60)
        client.loop_start()
        
        while True:
            data = generate_sensordata()
            payload = json.dumps(data)
            client.publish(TOPIC, payload)
            print(f"📡 Lähetetty: {payload}")
            time.sleep(10)
    except Exception as e:
        print(f"❌ MQTT Virhe: {e}")

if __name__ == "__main__":
    # Käynnistetään MQTT-lähetys taustalle
    mqtt_thread = threading.Thread(target=run_mqtt_logic, daemon=True)
    mqtt_thread.start()

    # Käynnistetään Flask Renderiä varten (portti 10000)
    render_port = int(os.environ.get("PORT", 10000))
    print(f"✅ Backend Online | Port: {render_port} | Topic: {TOPIC}")
    app.run(host='0.0.0.0', port=render_port)