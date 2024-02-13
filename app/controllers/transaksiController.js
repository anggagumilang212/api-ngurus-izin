const db = require("../models");
const Transaksi = db.transaksi;
const Op = db.Sequelize.Op;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

// Create and Save a new transaksi
exports.create = (req, res) => {
    // Validate request
    if (!req.body.id_layanan) {
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

  const transaksiSerializer = new JSONAPISerializer('transaksi', {
    attributes: ['id_layanan', 'ktp', 'npwp', 'phone', 'lokasi'],
  });

// Retrieve all transaksis from the database.
exports.findAll = async (req, res) => {
  try {
    const transaksis = await Transaksi.findAll();
    
    // Gunakan serializer untuk mengubah data menjadi JSON
    const transaksi = transaksiSerializer.serialize(transaksis);

    // Kirim response dengan data JSON
    res.send(transaksi);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error retrieving transaksi.' });
  }
};

// Find a single admin with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Transaksi.findByPk(id)
    .then(data => {
      if (data) {
        const serializedData = transaksiSerializer.serialize(data);
        res.send(serializedData);
      } else {
        res.status(404).send({
          message: `Cannot find transaksi with id=${id}.`
        });
      }
    })
    .catch(err => {
      console.error(err);
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