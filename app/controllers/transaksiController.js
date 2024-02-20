const db = require("../models");
const Transaksi = db.transaksi;
const Op = db.Sequelize.Op;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const bufferPlugin = require("buffer-serializer");
const multer = require('multer');
const { ktpSatuMiddleware, ktpDuaMiddleware, npwpSatuMiddleware, npwpDuaMiddleware  } = require('../middleware/transaksi');

// Create and Save a new transaksi
exports.create = async (req, res, next) => {
  try {
   // Upload ktp_satu
   await ktpSatuMiddleware(req, res, next);
   const ktpSatuName = `${req.file.filename}`;

   // Upload ktp_dua
   await ktpDuaMiddleware(req, res, next);
   const ktpDuaName = `${req.file.filename}`;

   // Upload npwp_satu
   await npwpSatuMiddleware(req, res, next);
   const npwpSatuName = `${req.file.filename}`;

   // Upload npwp_dua
   await npwpDuaMiddleware(req, res, next);
   const npwpDuaName = `${req.file.filename}`;

   const imageUrl = `${req.protocol}://${req.get('host')}/transaksi/${file.filename}`;

   // ...

   const transaksi = {
     id_layanan: req.body.id_layanan,
     ktp_satu: ktpSatuName,
     ktp_dua: ktpDuaName,
     npwp_satu: npwpSatuName,
     npwp_dua: npwpDuaName,
     url_ktp_satu: imageUrl,
     url_ktp_dua: `${imageUrl}/ktp_dua`,
     url_npwp_satu: `${imageUrl}/npwp_satu`,
     url_npwp_dua: `${imageUrl}/npwp_dua`,
     phone: req.body.phone,
     domisili: req.body.domisili,
     status_transaksi: 1,
   };

    // Simpan layanan ke database menggunakan metode yang sesuai
    // Tangani kesalahan dan skenario keberhasilan sesuai kebutuhan
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }
    // Contoh penggunaan Sequelize (ganti dengan ORM Anda):
    const newTransaksi = await Transaksi.create(transaksi);
    res.status(201).send(newTransaksi); // Atau respons yang diinginkan
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

  const transaksiSerializer = new JSONAPISerializer('transaksi', {
    attributes: ['id_layanan', 'ktp_satu', 'ktp_dua', 'npwp_satu', 'npwp_dua',  'npwp', 'phone', 'domisili'],
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