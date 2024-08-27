// const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  const users = sequelize.define(
    "user_verifications",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      expired_time: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      is_verified: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      code: {
        allowNull: true,
        type: DataTypes.BIGINT,
      },
      attempt_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: "user_verifications_uuid_unique",
      },
      token: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      verified_time: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
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
    },
    {
      underscored: true,
      sequelize,
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
