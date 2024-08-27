// const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  const users = sequelize.define(
    "users",
    {
      firstname: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      lastname: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      Address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: "users_email_unique",
      },
      email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      signup_type: {
        type: DataTypes.ENUM("Invite", "General", "Social"),
        allowNull: false,
        defaultValue: "General",
      },
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

      refferal_code: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      underscored: true,
      sequelize,
      tableName: "users",
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
