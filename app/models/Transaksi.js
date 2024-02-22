module.exports = (sequelize, Sequelize) => {
    const Transaksi = sequelize.define("transaksi", {
      id_layanan: {
        type: Sequelize.INTEGER
      },
      ktp_satu: {
        type: Sequelize.STRING
      },
      ktp_dua: {
        type: Sequelize.STRING
      },
      npwp_satu: {
        type: Sequelize.STRING
      },
      npwp_dua: {
        type: Sequelize.STRING
      },
      url_ktp_satu: {
        type: Sequelize.STRING
      },
      url_ktp_dua: {
        type: Sequelize.STRING
      },
      url_npwp_satu: {
        type: Sequelize.STRING
      },
      url_npwp_dua: {
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