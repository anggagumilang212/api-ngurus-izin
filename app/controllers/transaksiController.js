const db = require("../models");
const Transaksi = db.transaksi;
const Op = db.Sequelize.Op;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const bufferPlugin = require("buffer-serializer");
const multer = require('multer');
const upload = require('../middleware/transaksi');

exports.create = async (req, res) => {
  try {
    const files = req.files;


      // Ambil nama file dan buat URL gambar
      const ktpName = files.find(file => file.fieldname === 'ktp').filename;
      const npwpName = files.find(file => file.fieldname === 'npwp').filename;

      const ktpImageUrl = `${req.protocol}://${req.get('host')}/layanan/${ktpName}`;
      const npwpImageUrl = `${req.protocol}://${req.get('host')}/layanan/${npwpName}`;

      const transaksi = {
        id_layanan: req.body.id_layanan,
        ktp: ktpName,
        npwp: npwpName,
        url_ktp: ktpImageUrl,
        url_npwp: npwpImageUrl,
        phone: req.body.phone,
        domisili: req.body.domisili,
        status_transaksi: 1,
      };
      // Respon sukses jika semuanya berhasil
    const newTransaksi = await Transaksi.create(transaksi);
    res.status(201).send(newTransaksi); // Atau respons yang diinginkan
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}


  const transaksiSerializer = new JSONAPISerializer('transaksi', {
    attributes: ['id_layanan', 'ktp', 'ktp', 'url_ktp', 'url_npwp', 'phone', 'domisili'],
    keyForAttribute: 'camelCase',

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