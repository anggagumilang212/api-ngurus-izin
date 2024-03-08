const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../configs/database"); // Mengimpor JWT_SECRET dari file konfigurasi

const authMiddleware = (req, res, next) => {
  // Dapatkan token dari header Authorization
  const token = req.header("Authorization");

  // Periksa jika token tidak ada
  if (!token) {
    return res
      .status(401)
      .json({ message: "Missing token, authorization denied" });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Tambahkan user ke request untuk digunakan di endpoint terproteksi
    req.user = decoded;

    // Lanjutkan ke middleware berikutnya atau ke endpoint
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
