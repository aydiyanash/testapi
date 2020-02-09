import path from "path"
import fs from "fs"

const { File } = require('../../models');


class Files {
    static upload (req, res) {
        const { file } = req.files;
        const filename = file.name;
        const fileRecord = {
            path: `./files/${filename}`,
            name: filename,
            extension: path.extname(filename),
            mime: file.mimetype,
            size: file.size,
            uploaded: new Date()
        };
        try{
            File.create(fileRecord).then((res) => {
                file.mv(`./files/${res.name}`, err => {
                    if (err)
                        return res.status(500).send(err);
                })
            });
            res.json({
                success: true,
                message: "file uploaded!",
            })
        } catch (e) {
            res.json({
                success: false,
                message: e.message
            })
        }

    }

    static async getFiles (req, res) {
        const { list_size } = req.query || 10;
        const { page } = req.query || 1;

        const paginate = ({page, list_size}) => {
            const offset = page === 1 ? 0 : (page - 1) * list_size;
            const limit = parseInt(list_size);

            return {
                offset,
                limit,
            };
        };

        try {
            const files = await File.findAll({
                where :{},
                ...paginate({page, list_size})
            });

            res.json({
                success: true,
                data: files
            })
        }catch (e) {
            res.json({
                success: false,
                message: e.message
            })
        }

    }
    
    static async deleteFile (req, res) {
        const { id } = req.params;

        try{
            const file = await File.findOne({
                where: {id}
            });

            const  deleteFileRecord = (err) => {
                if(err){
                    return res.json({
                        success: false,
                        message: err.message
                    });
                }

                File.destroy({
                    where: { id }
                });
                res.json({
                    success: true,
                    message: "file deleted!",
                })
            };

            fs.unlink(file.path, deleteFileRecord);
        }catch (e) {
            res.json({
                success: false,
                message: e.message
            })
        }
    }

    static async getFileById (req, res) {
        const { id } = req.params;

        try{
            const file = await File.findOne({
                where: { id }
            });

            if (file){
                res.json({
                    success: true,
                    file
                })
            }else {
                res.sendStatus(404);
            }

        }catch (e) {
            res.json({
                success: false,
                message: e.message
            })
        }
    }

    static async downloadFile (req, res) {
        const { id } = req.params;

        try{
            const file = await File.findOne({
                where: { id }
            });

            if (file){
               res.download(file.path);
            }else {
                res.sendStatus(404);
            }

        }catch (e) {
            res.json({
                success: false,
                message: e.message
            })
        }
    }

    static async updateFile (req, res) {
        const { file } = req.files;
        const { id } = req.params;
        const filename = file.name;
        const fileRecord = {
            path: `./files/${filename}`,
            name: filename,
            extension: path.extname(filename),
            mime: file.mimetype,
            size: file.size,
            uploaded: new Date()
        };
        try{
          const updated = await File.update(fileRecord,{
                where: { id }
            });

          if(updated[0]){
              res.json({
                  success: false,
                  message: 'file updated!',
              })
          }
          else {
              res.sendStatus(404);
          }

        }catch (e) {
            res.json({
                success: false,
                message: e.message
            })
        }
    }

}


module.exports = Files;