const db = require("../models");
const Tentang = db.tentang;
const Op = db.Sequelize.Op;

// Create and Save a new Tentang
exports.create = (req, res) => {
    // Validate request
    if (!req.body.tentang) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Create a Tutorial
    const tentang = {
      tentang: req.body.tentang,
      phone: req.body.phone,
      email: req.body.email,
      instagram: req.body.instagram,
    };
  
    // Save Tutorial in the database
    Tentang.create(tentang)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tentng."
        });
      });
  };

// Retrieve all Tentangs from the database.
exports.findAll = (req, res) => {
    const tentang = req.query.tentang;
    var condition = tentang ? { tentang: { [Op.like]: `%${tentang}%` } } : null;
  
    Tentang.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Tentangs."
        });
      });
  };

// Find a single Tentang with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Tentang.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Tentang with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Tentang with id=" + id
        });
      });
  };

// Update a Tentang by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
  
    Tentang.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Tentang was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Tentang with id=${id}. Maybe Tentang was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Tentang with id=" + id
        });
      });
  };

// Delete a Tentang with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Tentang.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Tentang was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Tentang with id=${id}. Maybe Tentang was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Tentang with id=" + id
        });
      });
  };

// Delete all Tentangs from the database.
exports.deleteAll = (req, res) => {
    Tentang.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} Tentangs were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all Tentangs."
        });
      });
  };

// Find all filter Tentangs (phone)
// exports.findAllPublished = (req, res) => {
//     Tentang.findAll({ where: { phone: true } })
//       .then(data => {
//         res.send(data);
//       })
//       .catch(err => {
//         res.status(500).send({
//           message:
//             err.message || "Some error occurred while retrieving Tentangs."
//         });
//       });
//   };