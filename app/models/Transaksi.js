module.exports = (sequelize, Sequelize) => {
    const Transaksi = sequelize.define("transaksi", {
      id_layanan: {
        type: Sequelize.INTEGER
      },
      ktp: {
        type: Sequelize.STRING
      },
      npwp: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.INTEGER
      },
      lokasi: {
        type: Sequelize.STRING
      }
    });
  
    return Transaksi;
  };