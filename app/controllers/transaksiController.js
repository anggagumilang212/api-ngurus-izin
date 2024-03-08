const db = require("../models");
const Transaksi = db.transaksi;
const Op = db.Sequelize.Op;
const JSONAPISerializer = require("jsonapi-serializer").Serializer;
const bufferPlugin = require("buffer-serializer");
const multer = require("multer");

// exports.create = async (req, res) => {
//   try {
//     const file = req.files;

//       // Ambil nama file dan buat URL gambar
//       const ktpNameSatu = `${file.filename}`;
//       const ktpNameDua = `${file.filename}`;
//       const NpwpNameSatu = `${file.filename}`;
//       const NpwpNameDua = `${file.filename}`;
//       // const npwpName = files.find(file => files.fieldname == 'npwp').filename;

//       const ktpImageUrl = `${req.protocol}://${req.get('host')}/transaksi/${ktpNameSatu}`;
//       const npwpImageUrl = `${req.protocol}://${req.get('host')}/transaksi/${npwpName}`;

//       const transaksi = {
//         id_transaksi: req.body.id_transaksi,
//         ktp: ktpName,
//         npwp: npwpName,
//         url_ktp: ktpImageUrl,
//         url_npwp: npwpImageUrl,
//         phone: req.body.phone,
//         domisili: req.body.domisili,
//         status_transaksi: 1,
//       };
//       // Respon sukses jika semuanya berhasil
//     const newTransaksi = await Transaksi.create(transaksi);
//     res.status(201).send(newTransaksi); // Atau respons yang diinginkan
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// }

exports.create = async (req, res) => {
  try {
    const { ktp_satu, ktp_dua, npwp_satu, npwp_dua, phone, domisili } =
      req.body;

    // Simpan nama file gambar ke dalam variabel
    const ktpNameSatu = req.files["ktp_satu"][0].filename;
    const ktpNameDua = req.files["ktp_dua"][0].filename;
    const npwpNameSatu = req.files["npwp_satu"][0].filename;
    const npwpNameDua = req.files["npwp_dua"][0].filename;

    // Buat URL gambar berdasarkan nama file
    const ktpImageUrlSatu = `${req.protocol}://${req.get(
      "host"
    )}/uploads/${ktpNameSatu}`;
    const ktpImageUrlDua = `${req.protocol}://${req.get(
      "host"
    )}/uploads/${ktpNameDua}`;
    const npwpImageUrlSatu = `${req.protocol}://${req.get(
      "host"
    )}/uploads/${npwpNameSatu}`;
    const npwpImageUrlDua = `${req.protocol}://${req.get(
      "host"
    )}/uploads/${npwpNameDua}`;

    // Simpan data transaksi ke dalam objek
    const transaksi = {
      id_layanan: req.body.id_layanan,
      ktp_satu: ktpNameSatu,
      ktp_dua: ktpNameDua,
      npwp_satu: npwpNameSatu,
      npwp_dua: npwpNameDua,
      url_ktp_satu: ktpImageUrlSatu,
      url_ktp_dua: ktpImageUrlDua,
      url_npwp_satu: npwpImageUrlSatu,
      url_npwp_dua: npwpImageUrlDua,
      phone: phone,
      domisili: domisili,
      status_transaksi: req.body.status_transaksi,
    };

    // Simpan data transaksi ke dalam database
    const newTransaksi = await Transaksi.create(transaksi);

    // Respon sukses jika semuanya berhasil
    res.status(201).send(newTransaksi);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const transaksiSerializer = new JSONAPISerializer("transaksi", {
  attributes: [
    "id_transaksi",
    "ktp_satu",
    "ktp_dua",
    "npwp_satu",
    "npwp_dua",
    "url_ktp_satu",
    "url_ktp_dua",
    "url_npwp_satu",
    "url_npwp_dua",
    "phone",
    "domisili",
  ],
  keyForAttribute: "camelCase",
});

// Retrieve all transaksis from the database.
exports.findAll = async (req, res) => {
  try {
    // Mendapatkan nilai halaman dan ukuran halaman dari query string (default ke halaman 1 dan ukuran 10 jika tidak disediakan)
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    // Menghitung offset berdasarkan halaman dan ukuran halaman
    const offset = (page - 1) * pageSize;

    // Mengambil data transaksi dengan pagination menggunakan Sequelize
    const transaksis = await Transaksi.findAll({
      limit: pageSize,
      offset: offset,
    });

    // Menghitung total jumlah transaksi
    const totalCount = await Transaksi.count();

    // Menghitung total jumlah halaman berdasarkan ukuran halaman
    const totalPages = Math.ceil(totalCount / pageSize);

    // Menggunakan serializer untuk mengubah data menjadi JSON
    const transaksi = transaksiSerializer.serialize(transaksis);

    // Kirim response dengan data JSON dan informasi pagination
    res.send({
      data: transaksi,
      currentPage: page,
      totalPages: totalPages,
      pageSize: pageSize,
      totalCount: totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error retrieving transaksis." });
  }
};

// Find a single admin with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Transaksi.findByPk(id)
    .then((data) => {
      if (data) {
        const serializedData = transaksiSerializer.serialize(data);
        res.send(serializedData);
      } else {
        res.status(404).send({
          message: `Cannot find transaksi with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: "Error retrieving transaksi with id=" + id,
      });
    });
};

// Update a transaksi by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Transaksi.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "transaksi was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update transaksi with id=${id}. Maybe transaksi was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating transaksi with id=" + id,
      });
    });
};

// Delete a transaksi with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Transaksi.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "transaksi was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete transaksi with id=${id}. Maybe transaksi was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete transaksi with id=" + id,
      });
    });
};

// Delete all transaksis from the database.
exports.deleteAll = (req, res) => {
  Transaksi.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} transaksis were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all transaksis.",
      });
    });
};

// Find all filter transaksis (phone)
// exports.findAllPublished = (req, res) => {
//     transaksi.findAll({ where: { phone: true } })
//       .then(data => {
//         res.send(data);
//       })
//       .catch(err => {
//         res.status(500).send({
//           message:
//             err.message || "Some error occurred while retrieving transaksis."
//         });
//       });
//   };
