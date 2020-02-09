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
  File.addHook('beforeSave', async (file) => {
    const renameDuplicates = async () => {
      const count = await File.count({
        where: {
          name: file.name,
        }
      });

      if (count > 0){
        file.name = `${file.name} (copy)`;
        await renameDuplicates()
      }
    };
    if(file.isNewRecord){
      await renameDuplicates()
    }
  });
  return File;
};