module.exports = app => {
    const transaksi = require("../controllers/transaksiController");
    const upload = require('../middleware/transaksi');

    var router = require("express").Router();
  
    router.post("/", upload.single(), transaksi.create);
  
    // Retrieve all Tutorials
    router.get("/", transaksi.findAll);
  
    // Retrieve all published transaksi
    // router.get("/published", transaksi.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", transaksi.findOne);
  
    // Update a Tutorial with id
    router.put("/:id",  upload.single(), transaksi.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", transaksi.delete);
  
    // Delete all transaksi
    router.delete("/", transaksi.deleteAll);
  
    app.use('/api/transaksi', router);
  };