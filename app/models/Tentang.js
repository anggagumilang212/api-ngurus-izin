module.exports = (sequelize, Sequelize) => {
    const Tentang = sequelize.define("tentang", {
      nama: {
        type: Sequelize.STRING
      },
      tentang: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.INTEGER(15)
      },
      lokasi: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      maps: {
        type: Sequelize.STRING
      },
      gambar: {
        type: Sequelize.STRING
      },
      urlGambar: {
        type: Sequelize.STRING
      }
    });
  
    return Tentang;
  };