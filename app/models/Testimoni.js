
module.exports = (sequelize, Sequelize) => {
    const Testimoni = sequelize.define("testimoni", {
      nama: {
        type: Sequelize.STRING
      },
      gambar: {
        type: Sequelize.STRING
      },
      urlGambar: {
        type: Sequelize.STRING
      },
      testimoni: {
        type: Sequelize.STRING
      },
      jabatan: {
        type: Sequelize.STRING
      },
    });

    return Testimoni;
  };