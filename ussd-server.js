const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/* DISTÂNCIA */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/* TESTE */
app.get("/", (req, res) => {
  res.send("USSD LocalWab ON");
});

/* USSD ROUTE */
app.post("/ussd", async (req, res) => {

  const { text } = req.body;

  let response = "";

  if (text === "") {
    response = `CON LocalWab
1. Transportes próximos
2. Ajuda`;
  }

  else if (text === "1") {

    const userLat = -8.8383;
    const userLng = 13.2344;

    const snap = await db.collection("veiculos").get();

    let veiculos = [];

    snap.forEach(doc => {
      const v = doc.data();

      if (v.lat && v.lng) {

        const distancia = getDistance(userLat, userLng, v.lat, v.lng);
        const tempo = Math.round((distancia / 30) * 60);

        veiculos.push({
          nome: v.nomeVeiculo,
          rota: v.rota,
          distancia,
          tempo
        });

      }
    });

    veiculos.sort((a, b) => a.distancia - b.distancia);

    let out = "END Transportes próximos:\n\n";

    veiculos.slice(0, 3).forEach(v => {
      out += `${v.nome}\n${v.distancia.toFixed(1)} km\n${v.tempo} min\n${v.rota}\n\n`;
    });

    response = out;
  }

  else {
    response = "END Opção inválida";
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
});

app.listen(3000, () => {
  console.log("USSD FIREBASE ATIVO NA PORTA 3000");
});
