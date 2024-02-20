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
      url_ktp: {
        type: Sequelize.STRING
      },
      url_npwp: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.INTEGER(15)
      },
      domisili: {
        type: Sequelize.STRING
      },
      status_transaksi: {
        type: Sequelize.INTEGER
      }
    });


    return Transaksi;
  };