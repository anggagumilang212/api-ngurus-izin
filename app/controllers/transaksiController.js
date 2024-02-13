const db = require("../models");
const Transaksi = db.transaksi;
const Op = db.Sequelize.Op;

// Create and Save a new transaksi
exports.create = (req, res) => {
    // Validate request
    if (!req.body.nama) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Create a Tutorial
    const transaksi = {
      id_layanan: req.body.id_layanan,
      ktp: req.body.ktp,
      npwp: req.body.npwp,
      phone: req.body.phone,
      lokasi: req.body.lokasi,
    };
  
    // Save Tutorial in the database
    Transaksi.create(transaksi)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the transaksi."
        });
      });
  };

// Retrieve all transaksis from the database.
exports.findAll = (req, res) => {
    const id_layanan = req.query.id_layanan;
    var condition = id_layanan ? { id_layanan: { [Op.like]: `%${id_layanan}%` } } : null;
  
    Transaksi.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving transaksis."
        });
      });
  };

// Find a single transaksi with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Transaksi.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find transaksi with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving transaksi with id=" + id
        });
      });
  };

// Update a transaksi by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
  
    Transaksi.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "transaksi was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update transaksi with id=${id}. Maybe transaksi was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating transaksi with id=" + id
        });
      });
  };

// Delete a transaksi with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Transaksi.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "transaksi was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete transaksi with id=${id}. Maybe transaksi was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete transaksi with id=" + id
        });
      });
  };

// Delete all transaksis from the database.
exports.deleteAll = (req, res) => {
    Transaksi.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} transaksis were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all transaksis."
        });
      });
  };

// Find all filter transaksis (phone)
// exports.findAllPublished = (req, res) => {
//     layanan.findAll({ where: { phone: true } })
//       .then(data => {
//         res.send(data);
//       })
//       .catch(err => {
//         res.status(500).send({
//           message:
//             err.message || "Some error occurred while retrieving layanans."
//         });
//       });
//   };