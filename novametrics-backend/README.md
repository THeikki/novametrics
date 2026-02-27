# 🐍 NovaMetrics Backend
Tämä on järjestelmän datageneraattori, joka simuloi sensoridataa ja julkaisee sen MQTT-välittäjälle. Backend sisältää myös kevyen HTTP-rajapinnan Renderin Health Check -tarkistuksia varten.

# 🛠️ Teknologiat
Python 3.9 & Paho-MQTT v2.0: Viestinvälityksen teollisuusstandardi.
Flask & Flask-CORS: HTTP-palvelin portissa 10000 ja Cross-Origin-tuki frontend-herätyksille.
Docker: Kontitettu suoritusympäristö takaa siirrettävyyden.
ZoneInfo: Suomen aikavyöhykkeen (Europe/Helsinki) hallinta.

# 🚦 Asennus ja ajo (Lokaalisti)
1. Perinteinen ajo
Luo virtuaaliympäristö: python -m venv venv
Aktivoi se ja asenna riippuvuudet: pip install -r requirements.txt
Aseta ympäristömuuttujat .env-tiedostoon.

Suorita: 
```bash 
python main.py 
```

2. Docker (Suositeltu)
Rakenna ja aja kontti Docker-composella:
```bash
docker-compose up --build
```

Backend on tämän jälkeen saavutettavissa osoitteessa http://localhost:10000

# 🌐 Ympäristömuuttujat
Muuttuja	Kuvaus	Oletusarvo
PORT	HTTP-palvelimen portti	10000
MQTT_BROKER	MQTT-välittäjän osoite	broker.hivemq.com
MQTT_TOPIC	Julkaistava aihe	novametrics/projekti/2026/testi

# 🏗️ Arkkitehtuuri
Backend ajaa kahta säiettä samanaikaisesti:
MQTT-säie: Generoi ja lähettää simuloitua lämpötiladataa 10 sekunnin välein.
Flask-säie: Vastaa HTTP GET -pyyntöihin, mikä mahdollistaa palvelun pysymisen käynnissä pilvialustoilla ja tarjoaa diagnostiikkatietoa.
