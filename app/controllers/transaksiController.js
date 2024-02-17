const db = require("../models");
const Transaksi = db.transaksi;
const Op = db.Sequelize.Op;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const bufferPlugin = require("buffer-serializer");

// Create and Save a new transaksi
exports.create = async (req, res) => {
  try {
    // Process uploaded files:
    const imageUrls = [];
    for (const file of req.files) {
      // Simpan atau proses gambar dan dapatkan URL atau path-nya
      const imageUrl = `/images/${file.filename}`; // Ubah sesuai dengan lokasi penyimpanan gambar Anda
      imageUrls.push(imageUrl);
    }

    // Ambil URL gambar pertama jika tersedia
    const ktp = imageUrls.length > 0 ? imageUrls[0] : null;
    const npwp = imageUrls.length > 0 ? imageUrls[0] : null;

    // Buat objek layanan dengan URL gambar yang telah diproses
    const layanan = {
      id_layanan: req.body.id_layanan,
      ktp: ktp, // Gunakan URL gambar pertama yang telah diproses di sini
      ktp: npwp, // Gunakan URL gambar pertama yang telah diproses di sini
      phone: req.body.phone,
      lokasi: req.body.lokasi,
      status: req.body.status,
      // ... other fields
    };

    // Simpan layanan ke database menggunakan metode yang sesuai
    // Tangani kesalahan dan skenario keberhasilan sesuai kebutuhan

    // Contoh penggunaan Sequelize (ganti dengan ORM Anda):
    const newLayanan = await Layanan.create(layanan);
    res.status(201).send(newLayanan); // Atau respons yang diinginkan
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

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