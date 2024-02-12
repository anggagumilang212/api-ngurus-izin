module.exports = (sequelize, Sequelize) => {
    const Layanan = sequelize.define("layanan", {
      nama: {
        type: Sequelize.STRING
      },
      gambar: {
        type: Sequelize.BLOB("long")
      },
      harga: {
        type: Sequelize.INTEGER
      },
      deskripsi: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      }
    });
  
    return Layanan;
  };