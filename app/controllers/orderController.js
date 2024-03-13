const db = require("../models");
const Order = db.order;
const Layanan = db.layanan;
// const Op = db.Sequelize.Op;
// const { Op } = require("sequelize");
// const adminSerializer = require("../serializers/admin");
const JSONAPISerializer = require("jsonapi-serializer").Serializer;

const { Op } = require("sequelize");

// Create and Save a new order
exports.create = async (req, res) => {
  try {
    // Validate request
    if (
      !req.body.nama ||
      !req.body.phone ||
      !req.body.domisili ||
      !req.body.layananId
    ) {
      return res.status(400).send({ message: "Data is required!" });
    }

    // Find Layanan by layanan_id
    const layanan = await Layanan.findByPk(req.body.layananId);
    if (!layanan) {
      return res.status(404).send({ message: "Layanan not found!" });
    }

    // Create order object with layanan_id
    const order = {
      nama: req.body.nama,
      phone: req.body.phone || "",
      domisili: req.body.domisili || "",
      status: req.body.status || "",
      layananId: req.body.layananId, // Assign layanan_id from request body
    };

    // Save order to the database
    const createdOrder = await Order.create(order);
    res.send(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message || "Error creating order." });
  }
};

// Serialize
const adminSerializer = new JSONAPISerializer("order", {
  attributes: ["nama", "domisili", "phone", "layananId", "status"],
  keyForAttribute: "camelCase",
});

// exports.findAll = async (req, res) => {
//   try {
//     const orders = await Order.findAll({ include: Layanan });

//     const serializedOrders = orders.map((order) => {
//       const serializedOrder = adminSerializer.serialize(order);
//       if (order.layanan) {
//         serializedOrder.layanan = {
//           id: order.layanan.id,
//           nama: order.layanan.nama,
//           // Include other properties of Layanan as needed
//         };
//       }
//       return serializedOrder;
//     });

//     res.json(serializedOrders);
//   } catch (error) {
//     console.error("Error retrieving orders:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// Retrieve all orders from the database
// Retrieve all orders from the database

// exports.findAll = async (req, res) => {
//   try {
//     // Mendapatkan nilai halaman dan ukuran halaman dari query string (default ke halaman 1 dan ukuran 10 jika tidak disediakan)
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.pageSize) || 10;

//     // Menghitung offset berdasarkan halaman dan ukuran halaman
//     const offset = (page - 1) * pageSize;

//     // Query pencarian
//     const keyword = req.query.keyword || "";
//     const searchQuery = {
//       where: {
//         [Op.or]: [
//           { nama: { [Op.like]: `%${keyword}%` } },
//           { domisili: { [Op.like]: `%${keyword}%` } },
//           { phone: { [Op.like]: `%${keyword}%` } },
//         ],
//       },
//       include: { model: Layanan, as: "layanans" }, // Menyertakan model Layanan
//       limit: pageSize,
//       offset: offset,
//     };

//     // Mengambil data order dengan pagination menggunakan Sequelize
//     const orders = await Order.findAll(searchQuery);
//     const totalCount = await Order.count(searchQuery);

//     // Menghitung total jumlah halaman berdasarkan ukuran halaman
//     const totalPages = Math.ceil(totalCount / pageSize);

//     // Kirim response dengan data JSON dan informasi pagination
//     res.send({
//       data: orders,
//       currentPage: page,
//       totalPages: totalPages,
//       pageSize: pageSize,
//       totalCount: totalCount,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: "Error retrieving orders." });
//   }
// };

// code benar tapi salah
exports.findAll = async (req, res) => {
  try {
    // Mendapatkan nilai halaman dan ukuran halaman dari query string (default ke halaman 1 dan ukuran 10 jika tidak disediakan)
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    // Menghitung offset berdasarkan halaman dan ukuran halaman
    const offset = (page - 1) * pageSize;

    // Mengambil data order dengan pagination menggunakan Sequelize
    // const order = await Order.findAll({
    //   limit: pageSize,
    //   offset: offset,
    // });
    const keyword = req.query.keyword || "";
    const role = req.query.role;

    // Query pencarian
    const searchQuery = {
      where: {
        [Op.or]: [
          { nama: { [Op.like]: `%${keyword}%` } },
          { domisili: { [Op.like]: `%${keyword}%` } },
          { phone: { [Op.like]: `%${keyword}%` } },
        ],
      },
      limit: pageSize,
      offset: offset,
    };

    // Jika role adalah 'merchant', tambahkan kondisi status
    if (role == 'merchant') {
      searchQuery.where.status = { [Op.like]: '%on process%' };
    }

    const order = await Order.findAll(searchQuery);
    const totalCount = await Order.count(searchQuery);
    // Menghitung total jumlah order
    // const totalCount = await Order.count();

    // Menghitung total jumlah halaman berdasarkan ukuran halaman
    const totalPages = Math.ceil(totalCount / pageSize);

    // Menggunakan serializer untuk mengubah data menjadi JSON
    const admin = adminSerializer.serialize(order);

    // Kirim response dengan data JSON dan informasi pagination
    res.send({
      data: admin,
      currentPage: page,
      totalPages: totalPages,
      pageSize: pageSize,
      totalCount: totalCount,
      role: req.query.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error retrieving orders." });
  }
};

// Find a single admin with an id

exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).send({
        message: `Cannot find order with id=${id}.`,
      });
    }

    const serializedOrder = adminSerializer.serialize(order);

    res.send(serializedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: `Error retrieving order with id=${id}`,
    });
  }
};

// Update a order by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;

  // Check if password is included in update request
  if (req.body.password) {
    const saltRounds = 10; // Adjust salt rounds as needed (higher for stronger hashing)
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Update order object with hashed password
    req.body.password = hashedPassword;
  }

  Order.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "order was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update order with id=${id}. Maybe order was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating order with id=" + id,
      });
    });
};

// Delete a order with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Order.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "order was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete order with id=${id}. Maybe order was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete order with id=" + id,
      });
    });
};

// Delete all orders from the database.
exports.deleteAll = (req, res) => {
  Order.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} orders were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all orders.",
      });
    });
};
