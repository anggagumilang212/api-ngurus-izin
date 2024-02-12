module.exports = app => {
    const layanan = require("../controllers/layananController");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", layanan.create);
  
    // Retrieve all Tutorials
    router.get("/", layanan.findAll);
  
    // Retrieve all published layanan
    // router.get("/published", layanan.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", layanan.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", layanan.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", layanan.delete);
  
    // Delete all layanan
    router.delete("/", layanan.deleteAll);
  
    app.use('/api/layanan', router);
  };