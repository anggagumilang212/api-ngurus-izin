module.exports = (app) => {
  const order = require("../controllers/orderController");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", order.create);

  // Retrieve all Tutorials
  router.get("/", order.findAll);

  // Retrieve all published order
  // router.get("/published", order.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", order.findOne);

  // Update a Tutorial with id
  router.put("/:id", order.update);

  // Delete a Tutorial with id
  router.delete("/:id", order.delete);

  // Delete all order
  router.delete("/", order.deleteAll);

  app.use("/api/order", router);
};
