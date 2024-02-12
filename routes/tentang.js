const router = require("express").Router();
const { tentang } = require("../controllers");

// GET localhost:8080/karyawan => Ambil data semua karyawan
router.get("/tentang", tentang.getTentang);

// GET localhost:8080/karyawan/2 => Ambil data semua karyawan berdasarkan id = 2
router.get("/tentang/:id", tentang.getTentangByID);

// POST localhost:8080/karyawan/add => Tambah data karyawan ke database
router.post("/tentang/add", tentang.addDataTentang);

// POST localhost:8080/karyawan/2 => Edit data karyawan
router.post("/tentang/edit", tentang.editDataTentang);

// POST localhost:8080/karyawan/delete => Delete data karyawan
router.post("/tentang/delete/", tentang.deleteDataTentang);

module.exports = router;
