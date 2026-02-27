# 🚀 NovaMetrics Live
NovaMetrics on reaaliaikainen Full Stack -valvontajärjestelmä, joka on suunniteltu osoittamaan nykyaikaisten IoT-arkkitehtuurien, viestivälityksen ja kontituksen hallintaa. Järjestelmä visualisoi sensoridataa suoraan selaimessa matalalla viiveellä.
[https://novametrics.vercel.app]

# ⚠️ Huomautus (Cloud Hosting):
Backend on sijoitettu Renderin ilmaiselle tasolle (Free Tier). Palvelun luonteen vuoksi backend "nukahtaa" passiivisuuden aikana.
Käyttöliittymä herättää backendin automaattisesti, mutta ensimmäisellä käynnistyskerralla datan saapuminen voi kestää 1–2 minuuttia. Tämän jälkeen järjestelmä toimii reaaliajassa.

# 🛠️ Teknologiapino
**Frontend (novametrics-ui)**
React 18 & TypeScript: Tyypitetty ja vakaa käyttöliittymä.
MQTT.js & WebSockets (WSS): Reaaliaikainen tiedonsiirto salatun yhteyden yli.
Page Visibility API: Automaattinen uudelleenkytkentä, kun välilehti aktivoidaan taustalta.
Chart.js: Dynaaminen datan visualisointi.
Tailwind CSS: Moderni responsiivinen ulkoasu.
Hosting: Vercel.

**Backend (novametrics-backend)**
Python 3.9: Kevyt ja tehokas datan generointi.
Flask & Flask-CORS: HTTP-palvelin Renderin Health Check -tarkistuksia ja selaimen Cross-Origin-pyyntöjä varten.
Paho-MQTT v2.0: Teollisuusstandardi viestinvälitykseen.
Docker: Kontitettu suoritusympäristö takaa siirrettävyyden.
Hosting: Render (Docker Web Service).
Infrastructure
MQTT (HiveMQ): Julkinen viestivälityspalvelin (Broker) WebSockets-tuella.
Monorepo: Molemmat osiot samassa arkistossa hallittavuuden parantamiseksi.

# 🏗️ Arkkitehtuuri
Backend pyörii Docker-kontissa ja generoi sensoridataa 10 sekunnin välein.
Viestinvälitys: Data julkaistaan MQTT-protokollalla HiveMQ-välittäjälle.
Frontend: React-sovellus tilaa datan Secure WebSocket (WSS) -yhteyden yli.
Resilienssi: Sovellus tunnistaa selaimen säästötilan ja palauttaa yhteyden automaattisesti välilehden aktivoinnin yhteydessä.

# 🚦 Käyttöönotto (Lokaalisti)
1. Backend (Docker Compose)
```bash
cd novametrics-backend
docker-compose up --build
```

Backend vastaa osoitteessa http://localhost:10000

2. Frontend
Luo .env-tiedosto novametrics-ui-kansioon:
env
VITE_MQTT_BROKER_URL=wss://broker.hivemq.com:8884/mqtt
VITE_MQTT_TOPIC=novametrics/projekti/2026/testi
VITE_RENDER_BACKEND_URL=http://localhost:10000
Käytä koodia harkiten.

Käynnistä kehityspalvelin:
```bash
cd novametrics-ui
npm install
npm run dev
```

# ✍️ Tekijä
Heikki Törmänen
© 2026 NovaMetrics Project