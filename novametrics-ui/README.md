# ⚛️ NovaMetrics UI
Reaaliaikainen Dashboard, joka visualisoi sensoridatan selaimessa matalalla viiveellä. Sovellus on optimoitu toimimaan saumattomasti pilviympäristöissä ja kestämään selaimen säästötilat.

# 🛠️ Teknologiat
React 18 & TypeScript: Tyypitetty ja tehokas käyttöliittymä.
Tailwind CSS v4: Moderni ja suorituskykyinen tyylitys.
Chart.js: Dynaaminen ja responsiivinen lämpötilakuvaaja.
MQTT.js: WebSocket-pohjainen (WSS) tiedonsiirto.
Page Visibility API: Automaattinen uudelleenkytkentä, kun välilehti aktivoidaan.

# 🚦 Kehitys
Asenna riippuvuudet:
```bash
npm install
```

Määritä ympäristömuuttujat luomalla .env-tiedosto:
env
VITE_MQTT_BROKER_URL=wss://broker.hivemq.com:8884/mqtt
VITE_MQTT_TOPIC=novametrics/projekti/2026/testi
VITE_RENDER_BACKEND_URL=https://novametrics-backend.onrender.com

Käynnistä kehityspalvelin:
```bash
npm run dev
```

# 🏗️ Ominaisuudet
Backend-herätys: Käyttöliittymä lähettää automaattisen herätyspyynnön Render-pohjaiselle backendille sivun latautuessa.
Reaaliaikaisuus: Sensoridata päivittyy välittömästi ilman sivun uudelleenlatausta.
Vikasietoisuus: Älykäs uudelleenkytkentälogiikka MQTT-yhteyden katketessa.

# 🧪 Testaus & Build
Testit:
```bash 
npm test
```
Tuotantoversio: 
```bash
npm run build
```