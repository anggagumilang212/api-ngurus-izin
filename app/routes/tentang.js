module.exports = app => {
    const tentang = require("../controllers/tentangContoller");
    const express = require('express');
  const router = express.Router();
    const upl_tentang = require('../middleware/layanan');

    // Create a new Tutorial
    router.post("/", upl_tentang.single('gambar'), tentang.create);
  
    // Retrieve all Tutorials
    router.get("/", tentang.findAll);
  
    // Retrieve all published tentang
    // router.get("/published", tentang.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", tentang.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", tentang.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", tentang.delete);
  
    // Delete all tentang
    router.delete("/", tentang.deleteAll);
  
    app.use('/api/tentang', router);
  };