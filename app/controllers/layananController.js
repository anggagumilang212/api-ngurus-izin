const db = require("../models");

const Layanan = db.layanan;
const Op = db.Sequelize.Op;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const multer = require('multer');

// Create and Save a new layanan
exports.create= async (req, res) => {
  // Implement validations for required fields, file types, sizes, etc.

  // Process uploaded files:
  const imageUrls = [];
  for (const file of req.files) {
    // Extract relevant information (e.g., path, filename, metadata)
    // Store or process images as needed (e.g., resize, compress)
    imageUrls.push('public/image');
  }

  // Create a new layanan object with processed image data
  const layanan = {
    nama: req.body.nama,
    gambar: imageUrls, // Use processed 'imageUrls' here
    harga: req.body.harga,
    deskripsi: req.body.deskripsi,
    status: req.body.status,
    // ... other fields
  };

  // Save the layanan to your database using appropriate methods
  // Handle errors and success scenarios accordingly

  // Example using Sequelize (replace with your ORM):
  try {
    const newLayanan = await Layanan.create(layanan);
    res.status(201).send(newLayanan); // Or your desired response
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

// serialize
const layananSerializer = new JSONAPISerializer('layanan', {
  attributes: ['nama', 'gambar', 'harga', 'deskripsi', 'status'],
});

// Retrieve all layanans from the database.

exports.findAll = async (req, res) => {
  try {
    const layanans = await Layanan.findAll();

    // Gunakan serializer untuk mengubah data menjadi JSON
    const layanan = layananSerializer.serialize(layanans);

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
        const serializedData = layananSerializer.serialize(data);
        res.send(serializedData);
      } else {
        res.status(404).send({
          message: `Cannot find layanan with id=${id}.`
        });
      }
    })
    .catch(err => {
      console.error(err);
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