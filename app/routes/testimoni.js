module.exports = app => {
  const express = require('express');
  const router = express.Router();
  const testimoni = require('../controllers/testimoniController');
  const upl_testimoni = require('../middleware/testimnoni');
  // Route for image upload
  router.post('/', upl_testimoni.single('gambar'), testimoni.create);
  
    // Retrieve all Tutorials
    router.get("/", testimoni.findAll);
  
    // Retrieve all published testimoni
    // router.get("/published", testimoni.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", testimoni.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", upl_testimoni.single('gambar'), testimoni.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", testimoni.delete);
  
    // Delete all testimoni
    router.delete("/", testimoni.deleteAll);
  
    app.use('/api/testimoni', router);
  };