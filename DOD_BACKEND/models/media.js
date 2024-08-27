// const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  const users = sequelize.define(
    "media",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      entity_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      entity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      media_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      media_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      mime_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      ext: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      created_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      deleted_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      underscored: true,
      sequelize,
      tableName: "media",
      timestamps: true,
      paranoid: true,
      defaultScope: {
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "deletedAt",
            "deleted_by",
            "is_deleted",
          ],
        },
      },
    }
  );

  return users;
};
