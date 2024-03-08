module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const layanan = require("../controllers/layananController");
  const upl_layanan = require("../middleware/layanan");
  const { Layanan } = require("../models/Layanan"); // Pastikan path model sesuai

  // Route for image upload
  router.post("/", upl_layanan.single("gambar"), layanan.create);

  // Retrieve all Tutorials
  router.get("/", layanan.findAll);

  // Retrieve all published layanan
  // router.get("/published", layanan.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", layanan.findOne);

  // Update a Tutorial with id
  router.put("/:id", upl_layanan.single("gambar"), layanan.update);

  // Delete a Tutorial with id
  router.delete("/:id", layanan.delete);

  // Delete all layanan
  router.delete("/", layanan.deleteAll);

  router.get("/ujicoba-spam", async (req, res) => {
    try {
      // Membuat 1000 entri transaksi secara bersamaan
      const promises = [];
      for (let i = 0; i < 1000; i++) {
        promises.push(
          Layanan.create({
            nama: "test",
            gambar: "tesst",
            urlGambar: "imageUrl",
            harga: 123,
            deskripsi: "test",
            status: 1,
          })
        );
      }

      // Menunggu semua transaksi selesai dibuat
      await Promise.all(promises);

      res.send("1000 data transaksi berhasil ditambahkan.");
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Gagal menambahkan data transaksi." });
    }
  });

  app.use("/api/layanan", router);
};
