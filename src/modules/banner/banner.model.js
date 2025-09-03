const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sql.config");
const {Status} = require("../../config/constants");

const BannerModel = sequelize.define("Banners", {
    _id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    image: {
        type: DataTypes.JSON,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(Object.values(Status)),
        defaultValue: Status.INACTIVE,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now()
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now(),
        onUpdate: Date.now() 
    }
});

module.exports = BannerModel;''