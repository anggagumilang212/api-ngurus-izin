const db = require("../models");
const Layanan = db.layanan;
const Op = db.Sequelize.Op;
var JSONAPISerializer = require('jsonapi-serializer').Serializer;

// Create and Save a new layanan
exports.create = (req, res) => {
    // Validate request
    if (!req.body.nama) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Create a Layanan
    const layanan = {
      nama: req.body.nama,
      gambar: req.body.gambar,
      harga: req.body.harga,
      deskripsi: req.body.deskripsi,
      status: req.body.status,
    };
  
    // Save Layanan in the database
    Layanan.create(layanan)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Layanan."
        });
      });
  };

// Retrieve all layanans from the database.

exports.findAll = async (req, res) => {
  try {
    const layanans = await Layanan.findAll();
    const Serializer = new JSONAPISerializer('layanan', {
      attributes: ['nama', 'gambar', 'harga', 'deskripsi', 'status']
    });
    // Gunakan serializer untuk mengubah data menjadi JSON
    const layanan = Serializer.serialize(layanans);

    // Kirim response dengan data JSON
    res.send(layanan);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error retrieving layanans.' });
  }
};

// Find a single layanan with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Layanan.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find layanan with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving layanan with id=" + id
        });
      });
  };

// Update a layanan by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
  
    Layanan.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "layanan was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update layanan with id=${id}. Maybe layanan was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating layanan with id=" + id
        });
      });
  };

// Delete a layanan with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Layanan.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "layanan was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete layanan with id=${id}. Maybe layanan was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete layanan with id=" + id
        });
      });
  };

// Delete all layanans from the database.
exports.deleteAll = (req, res) => {
    Layanan.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} layanans were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all layanans."
        });
      });
  };

// Find all filter layanans (phone)
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