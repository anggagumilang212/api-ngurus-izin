const express = require("express");
const cors = require("cors");

const app = express();
app.use('/layanan', express.static('public/assets/images/layanan')); //masukkan public direktori
app.use('/transaksi', express.static('public/assets/images/transaksi')); //masukkan public direktori
app.use(cors());

const db = require("./app/models");
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Izin Aja application." });
});


require("./app/routes/tentang")(app);
require("./app/routes/layanan")(app);
require("./app/routes/transaksi")(app);
require("./app/routes/administrators")(app);

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});