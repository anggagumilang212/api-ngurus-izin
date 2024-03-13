const db = require("../models");
const Administrators = db.administrators;
const Op = db.Sequelize.Op; // Import bcrypt for password hashing
const bcrypt = require("bcryptjs");

const JSONAPISerializer = require("jsonapi-serializer").Serializer;

// Create and Save a new administrators
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .send({ message: "Username and password are required!" });
    }

    if (!req.body.role) {
      return res
        .status(400)
        .send({ message: "Role are required!" });
    }

    // Hash password securely using bcrypt
    const saltRounds = 10; // Adjust salt rounds as needed (higher for stronger hashing)
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Create administrator object with hashed password
    const administrator = {
      username: req.body.username,
      email: req.body.email || "", // Assign an empty string if email is not provided
      name: req.body.name || "", // Assign an empty string if name is not provided
      phone: req.body.phone || "", // Assign an empty string if phone is not provided
      role: req.body.role, // Assign an empty string if phone is not provided
      password: hashedPassword,
    };

    // Save administrator to the database
    const createdAdministrator = await Administrators.create(administrator);
    res.send(createdAdministrator);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: error.message || "Error creating administrator." });
  }
};

// serialize
const adminSerializer = new JSONAPISerializer("administrators", {
  attributes: ["username", "email", "password", "name", "phone", "role"],
});

// Retrieve all administratorss from the database.
exports.findAll = async (req, res) => {
  try {
    // Mendapatkan nilai halaman dan ukuran halaman dari query string (default ke halaman 1 dan ukuran 10 jika tidak disediakan)
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    // Menghitung offset berdasarkan halaman dan ukuran halaman
    const offset = (page - 1) * pageSize;

    // Mengambil data administrators dengan pagination menggunakan Sequelize
    // const administrators = await Administrators.findAll({
    //   limit: pageSize,
    //   offset: offset,
    // });
    const keyword = req.query.keyword || "";

    // Query pencarian
    const searchQuery = {
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { username: { [Op.like]: `%${keyword}%` } },
          { email: { [Op.like]: `%${keyword}%` } },
          { phone: { [Op.like]: `%${keyword}%` } },
        ],
      },
      limit: pageSize,
      offset: offset,
    };
    const administrators = await Administrators.findAll(searchQuery);
    const totalCount = await Administrators.count(searchQuery);
    // Menghitung total jumlah administrators
    // const totalCount = await Administrators.count();

    // Menghitung total jumlah halaman berdasarkan ukuran halaman
    const totalPages = Math.ceil(totalCount / pageSize);

    // Menggunakan serializer untuk mengubah data menjadi JSON
    const admin = adminSerializer.serialize(administrators);

    // Kirim response dengan data JSON dan informasi pagination
    res.send({
      data: admin,
      currentPage: page,
      totalPages: totalPages,
      pageSize: pageSize,
      totalCount: totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error retrieving administratorss." });
  }
};

// Find a single admin with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Administrators.findByPk(id)
    .then((data) => {
      if (data) {
        const serializedData = adminSerializer.serialize(data);
        res.send(serializedData);
      } else {
        res.status(404).send({
          message: `Cannot find admin with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: "Error retrieving admin with id=" + id,
      });
    });
};

// Update a administrators by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;

  // Check if password is included in update request
  if (req.body.password) {
    const saltRounds = 10; // Adjust salt rounds as needed (higher for stronger hashing)
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Update administrator object with hashed password
    req.body.password = hashedPassword;
  }
  else{
    req.body.password = req.body.password_lama
  }

  Administrators.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "administrators was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update administrators with id=${id}. Maybe administrators was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating administrators with id=" + id,
      });
    });
};

// Delete a administrators with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Administrators.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "administrators was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete administrators with id=${id}. Maybe administrators was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete administrators with id=" + id,
      });
    });
};

// Delete all administratorss from the database.
exports.deleteAll = (req, res) => {
  Administrators.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} administratorss were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all administratorss.",
      });
    });
};

// Find all filter administratorss (phone)
// exports.findAllPublished = (req, res) => {
//     administrators.findAll({ where: { phone: true } })
//       .then(data => {
//         res.send(data);
//       })
//       .catch(err => {
//         res.status(500).send({
//           message:
//             err.message || "Some error occurred while retrieving administratorss."
//         });
//       });
//   };
