const {Sequelize} = require("sequelize")
const {PgConfig} = require("./config")

const sequelize = new Sequelize(PgConfig.dbName, PgConfig.user, PgConfig.password, {
    host: PgConfig.host,
    port: PgConfig.port,
    dialect: `${PgConfig.dialect}`,
    // logging: false
});

(async() => {
    try {
        await sequelize.authenticate();
        console.log("****** SQL Server Connected Successfully ******")
    }catch (exception) {
        console.log("Error: ", exception)
    }
})();

module.exports = sequelize; 