// const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  const onBoarding = sequelize.define(
    "onboarding",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("PENDING", "COMPLETED", "REJECTED"),
        allowNull: false,
        defaultValue: "PENDING",
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
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      underscored: true,
      sequelize,
      tableName: "onboarding",
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

  return onBoarding;
};
