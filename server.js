const express = require("express");
const cors = require("cors");
const db = require("./app/models");

const app = express();

// Serve static files
app.use("/layanan", express.static("public/assets/images/layanan"));
app.use("/transaksi", express.static("public/assets/images/transaksi"));
app.use("/tentang", express.static("public/assets/images/tentang"));
app.use("/testimoni", express.static("public/assets/images/testimoni"));

// Sync database
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Set CORS options to allow all origins
const corsOptions = {
  origin: "*",
};

// Use CORS middleware with the provided configuration
app.use(cors(corsOptions));

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Izin Aja application." });
});

// Include routes
require("./app/routes/tentang")(app);
require("./app/routes/layanan")(app);
require("./app/routes/transaksi")(app);
require("./app/routes/testimoni")(app);
require("./app/routes/administrators")(app);
require("./app/routes/auth")(app);
require("./app/routes/order")(app);

// Set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
