module.exports = app => {
    const administrators = require("../controllers/administratorsController");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", administrators.create);
  
    // Retrieve all Tutorials
    router.get("/", administrators.findAll);
  
    // Retrieve all published administrators
    // router.get("/published", administrators.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", administrators.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", administrators.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", administrators.delete);
  
    // Delete all administrators
    router.delete("/", administrators.deleteAll);
  
    app.use('/api/administrators', router);
  };