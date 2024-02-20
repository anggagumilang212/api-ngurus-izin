const dbConfig = require("../configs/database.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tentang = require("./Tentang.js")(sequelize, Sequelize);
db.layanan = require("./Layanan.js")(sequelize, Sequelize);
db.transaksi = require("./Transaksi.js")(sequelize, Sequelize);
db.testimoni = require("./Testimoni.js")(sequelize, Sequelize);
db.administrators = require("./Administrators.js")(sequelize, Sequelize);

module.exports = db;