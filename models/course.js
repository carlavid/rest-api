"use strict";
const { Model, DataTypes, Sequelize } = require("sequelize");

module.exports = (Sequelize) => {
  class Course extends Model {}
  Course.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A title is required",
          },
          notEmpty: {
            msg: "Please provide a title",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A description is required",
          },
          notEmpty: {
            msg: "Please provide a description",
          },
        },
      },
      estimatedTime: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Estimated time is required",
          },
          notEmpty: {
            msg: "Please provide estimated time",
          },
        },
      },
      materialsNeeded: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Materials needed is required",
          },
          notEmpty: {
            msg: "Please provide materials needed",
          },
        },
      },
    },
    { sequelize }
  );

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };
  return Course;
};