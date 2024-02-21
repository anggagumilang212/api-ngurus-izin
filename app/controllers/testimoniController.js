const db = require("../models");

const Testimoni = db.testimoni;
const Op = db.Sequelize.Op;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const multer = require('multer');

// Create and Save a new testimoni
exports.create = async (req, res) => {
  try {
    const file = req.file;

    // Process uploaded files:
      // Simpan atau proses gambar dan dapatkan URL atau path-nya
      const imageName = `${file.filename}`;
      const imageUrl = `${req.protocol}://${req.get('host')}/testimoni/${file.filename}`;
    

    // Ambil URL gambar pertama jika tersedia

    // Buat objek testimoni dengan URL gambar yang telah diproses
    const testimoni = {
      nama: req.body.nama,
      gambar: imageName, 
      urlGambar: imageUrl, 
      testimoni: req.body.testimoni,
      jabatan: req.body.jabatan,
    };

    // Simpan testimoni ke database menggunakan metode yang sesuai
    // Tangani kesalahan dan skenario keberhasilan sesuai kebutuhan

    // Contoh penggunaan Sequelize (ganti dengan ORM Anda):
    const newtestimoni = await Testimoni.create(testimoni);
    res.status(201).send(newtestimoni); // Atau respons yang diinginkan
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

// serialize
const testimoniSerializer = new JSONAPISerializer('testimoni', {
  attributes: ['nama', 'gambar', 'urlGambar', 'testimoni', 'jabatan'],
  keyForAttribute: 'camelCase',

});

// Retrieve all testimonis from the database.
exports.findAll = async (req, res) => {
  try {
    // Mendapatkan nilai halaman dan ukuran halaman dari query string (default ke halaman 1 dan ukuran 10 jika tidak disediakan)
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    // Menghitung offset berdasarkan halaman dan ukuran halaman
    const offset = (page - 1) * pageSize;

    // Mengambil data testimoni dengan pagination menggunakan Sequelize
    const testimonis = await Testimoni.findAll({
      limit: pageSize,
      offset: offset
    });

    // Menghitung total jumlah testimoni
    const totalCount = await Testimoni.count();

    // Menghitung total jumlah halaman berdasarkan ukuran halaman
    const totalPages = Math.ceil(totalCount / pageSize);

    // Menggunakan serializer untuk mengubah data menjadi JSON
    const testimoni = testimoniSerializer.serialize(testimonis);

    // Kirim response dengan data JSON dan informasi pagination
    res.send({
      data: testimoni,
      currentPage: page,
      totalPages: totalPages,
      pageSize: pageSize,
      totalCount: totalCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error retrieving testimonis.' });
  }
};


// Find a single testimoni with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Testimoni.findByPk(id)
    .then(testimoni => {
      if (testimoni) {
        const serializedData = testimoniSerializer.serialize(testimoni);
        res.send(serializedData);
      } else {
        res.status(404).send({
          message: `Cannot find testimoni with id=${id}.`
        });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({
        message: "Error retrieving testimoni with id=" + id
      });
    });
};
// Update a testimoni by the id in the request
// Update a testimoni by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  const file = req.file;

  try {
    let testimoniData = req.body;
    
    // Jika pengguna mengunggah gambar baru, gunakan gambar yang baru diupdate
    if (file) {
      const imageName = file.filename;
      const imageUrl = `${req.protocol}://${req.get('host')}/testimoni/${file.filename}`;

      testimoniData = {
        ...testimoniData,
        gambar: imageName,
        urlGambar: imageUrl,
      };
    }
    
    // Temukan testimoni yang akan diupdate
    const testimoni = await Testimoni.findByPk(id);
    if (!testimoni) {
      return res.status(404).send({ message: `testimoni with id=${id} not found` });
    }

    // Perbarui data testimoni dengan data baru, termasuk data yang tidak berubah
    await testimoni.update(testimoniData);

    res.send({
      message: "testimoni berhasil diubah."
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};



// Delete a testimoni with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Testimoni.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "testimoni was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete testimoni with id=${id}. Maybe testimoni was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete testimoni with id=" + id
      });
    });
};

// Delete all testimonis from the database.
exports.deleteAll = (req, res) => {
  Testimoni.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} testimonis were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all testimonis."
      });
    });
};

// Find all filter testimonis (phone)
// exports.findAllPublished = (req, res) => {
//     testimoni.findAll({ where: { phone: true } })
//       .then(data => {
//         res.send(data);
//       })
//       .catch(err => {
//         res.status(500).send({
//           message:
//             err.message || "Some error occurred while retrieving testimonis."
//         });
//       });
//   };