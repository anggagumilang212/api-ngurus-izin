module.exports = (sequelize, Sequelize) => {
    const Tentang = sequelize.define("tentang", {
      tentang: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.INTEGER
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
      }
    });
  
    return Tentang;
  };