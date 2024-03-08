const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const Administrators = db.administrators; // Menggunakan model Administrators
const { JWT_SECRET } = require("../configs/database"); // Mengimpor nilai JWT_SECRET dari file konfigurasi

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari administrator berdasarkan email
    const administrator = await Administrators.findOne({
      where: { email: email },
    });

    // Jika administrator tidak ditemukan atau password salah, kirim respons error
    if (
      !administrator ||
      !(await bcrypt.compare(password, administrator.password))
    ) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Buat token JWT
    const token = jwt.sign({ id: administrator.id }, JWT_SECRET, {
      // Menggunakan JWT_SECRET sebagai kunci rahasia
      expiresIn: "1h",
    });

    // Kirim token sebagai respons
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fungsi logout
exports.logout = (req, res) => {
  try {
    // Dapatkan token dari header Authorization
    const token = req.header("Authorization");

    // Periksa jika token tidak ada
    if (!token) {
      return res.status(401).json({ message: "Missing token, logout failed" });
    }

    // Verifikasi token dan ambil ID pengguna dari token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // Hapus token dari sisi klien (misalnya, dengan menghapus token dari local storage)

    // Kirim respons logout berhasil
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
