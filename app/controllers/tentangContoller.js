const db = require("../models");

const Tentang = db.tentang;
const Op = db.Sequelize.Op;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const multer = require('multer');

// Create and Save a new Tentang
exports.create = async (req, res) => {
  try {
    const file = req.file;

    // Process uploaded files:
      // Simpan atau proses gambar dan dapatkan URL atau path-nya
      const imageName = `${file.filename}`;
      // local
      // const imageUrl = `${req.protocol}://${req.get('host')}/tentang/${file.filename}`;
      // production
       const imageUrl = `https://api.ngurusizin.online/tentang/${file.filename}`;
    

    // Ambil URL gambar pertama jika tersedia

    // Buat objek Tentang dengan URL gambar yang telah diproses
    const tentang = {
      nama: req.body.nama,
      tentang: req.body.tentang,
      phone: req.body.phone,
      email: req.body.email,
      lokasi: req.body.lokasi,
      gambar: imageName, 
      urlGambar: imageUrl, 
    };

    // Simpan Tentang ke database menggunakan metode yang sesuai
    // Tangani kesalahan dan skenario keberhasilan sesuai kebutuhan

    // Contoh penggunaan Sequelize (ganti dengan ORM Anda):
    const newTentang = await Tentang.create(tentang);
    res.status(201).send(newTentang); // Atau respons yang diinginkan
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

  const tentangSerializer = new JSONAPISerializer('tentang', {
    attributes: ['nama','tentang', 'phone', 'lokasi', 'email', 'gambar', 'urlGambar'],
    keyForAttribute: 'camelCase',

  });
  

// Retrieve all Tentangs from the database.
exports.findAll = async (req, res) => {
  try {
    // Mendapatkan nilai halaman dan ukuran halaman dari query string (default ke halaman 1 dan ukuran 10 jika tidak disediakan)
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    // Menghitung offset berdasarkan halaman dan ukuran halaman
    const offset = (page - 1) * pageSize;

    // Mengambil data tentang dengan pagination menggunakan Sequelize
    const tentangs = await Tentang.findAll({
      limit: pageSize,
      offset: offset
    });

    // Menghitung total jumlah tentang
    const totalCount = await Tentang.count();

    // Menghitung total jumlah halaman berdasarkan ukuran halaman
    const totalPages = Math.ceil(totalCount / pageSize);

    // Menggunakan serializer untuk mengubah data menjadi JSON
    const tentang = tentangSerializer.serialize(tentangs);

    // Kirim response dengan data JSON dan informasi pagination
    res.send({
      data: tentang,
      currentPage: page,
      totalPages: totalPages,
      pageSize: pageSize,
      totalCount: totalCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error retrieving tentangs.' });
  }
};

// Find a single admin with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Tentang.findByPk(id)
    .then(data => {
      if (data) {
        const serializedData = tentangSerializer.serialize(data);
        res.send(serializedData);
      } else {
        res.status(404).send({
          message: `Cannot find tentang with id=${id}.`
        });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({
        message: "Error retrieving tentang with id=" + id
      });
    });
};

// Update a Tentang by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  const file = req.file;

  try {
    let tentangData = req.body;
    
    // Jika pengguna mengunggah gambar baru, gunakan gambar yang baru diupdate
    if (file) {
      const imageName = file.filename;
       // local
      // const imageUrl = `${req.protocol}://${req.get('host')}/tentang/${file.filename}`;
      // production
      const imageUrl = `https://api.ngurusizin.online/tentang/${file.filename}`;
    
      tentangData = {
        ...tentangData,
        gambar: imageName,
        urlGambar: imageUrl,
      };
    }
    
    // Temukan tentang yang akan diupdate
    const tentang = await Tentang.findByPk(id);
    if (!tentang) {
      return res.status(404).send({ message: `tentang with id=${id} not found` });
    }

    // Perbarui data tentang dengan data baru, termasuk data yang tidak berubah
    await tentang.update(tentangData);

    res.send({
      message: "tentang berhasil diubah."
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
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