const db = require("../models");

const Layanan = db.layanan;
const Op = db.Sequelize.Op;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const multer = require('multer');


// Create and Save a new layanan
exports.create = async (req, res) => {
  try {
    const file = req.file;

    // Process uploaded files:
      // Simpan atau proses gambar dan dapatkan URL atau path-nya
      const imageName = `${file.filename}`;
      const imageUrl = `${req.protocol}://${req.get('host')}/layanan/${file.filename}`;
    

    // Ambil URL gambar pertama jika tersedia

    // Buat objek layanan dengan URL gambar yang telah diproses
    const layanan = {
      nama: req.body.nama,
      gambar: imageName, 
      urlGambar: imageUrl, 
      harga: req.body.harga,
      deskripsi: req.body.deskripsi,
      status: req.body.status,
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

// serialize
const layananSerializer = new JSONAPISerializer('layanan', {
  attributes: ['nama', 'gambar', 'urlGambar', 'harga', 'deskripsi', 'status'],
  keyForAttribute: 'camelCase',

});

// Retrieve all layanans from the database.

exports.findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    const keyword = req.query.keyword || '';

    // Query pencarian
    const searchQuery = {
      where: {
        [Op.or]: [
          { nama: { [Op.like]: `%${keyword}%` } },
          { harga: { [Op.like]: `%${keyword}%` } },
          { deskripsi: { [Op.like]: `%${keyword}%` } }
        ]
      },
      limit: pageSize,
      offset: offset
    };

    // Mengambil data layanan dengan pagination dan pencarian menggunakan Sequelize
    const layanans = await Layanan.findAll(searchQuery);
    const totalCount = await Layanan.count(searchQuery);

    const totalPages = Math.ceil(totalCount / pageSize);
    const layanan = layananSerializer.serialize(layanans);

    res.send({
      data: layanan,
      currentPage: page,
      totalPages: totalPages,
      pageSize: pageSize,
      totalCount: totalCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error retrieving layanans.' });
  }
};




// Find a single layanan with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Layanan.findByPk(id)
    .then(layanan => {
      if (layanan) {
        const serializedData = layananSerializer.serialize(layanan);
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
// Update a layanan by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  const file = req.file;

  try {
    let layananData = req.body;
    
    // Jika pengguna mengunggah gambar baru, gunakan gambar yang baru diupdate
    if (file) {
      const imageName = file.filename;
      const imageUrl = `${req.protocol}://${req.get('host')}/layanan/${file.filename}`;

      layananData = {
        ...layananData,
        gambar: imageName,
        urlGambar: imageUrl,
      };
    }
    
    // Temukan layanan yang akan diupdate
    const layanan = await Layanan.findByPk(id);
    if (!layanan) {
      return res.status(404).send({ message: `Layanan with id=${id} not found` });
    }

    // Perbarui data layanan dengan data baru, termasuk data yang tidak berubah
    await layanan.update(layananData);

    res.send({
      message: "Layanan berhasil diubah."
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
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