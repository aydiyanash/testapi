'use strict';
import Security from "../src/utils/security";

module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    path: DataTypes.STRING,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    extension: DataTypes.STRING,
    mime: DataTypes.STRING,
    size: DataTypes.INTEGER,
    uploaded: DataTypes.DATE
  }, {});
  return File;
};