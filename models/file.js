'use strict';
import Security from "../src/utils/security";

module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    path: DataTypes.STRING,
    name: DataTypes.STRING,
    extension: DataTypes.STRING,
    mime: DataTypes.STRING,
    size: DataTypes.INTEGER,
    uploaded: DataTypes.DATE
  }, {});
  return File;
};