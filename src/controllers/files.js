import path from "path"
import fs from "fs"

const { File } = require('../../models');


class Files {
    static async upload (req, res) {
        const { file } = req.files;
        const filename = `${req.user.id}-${new Date().toISOString()}-${file.name}`;
        const fileRecord = {
            path: `./files/${filename}`,
            name: filename,
            extension: path.extname(filename),
            mime: file.mimetype,
            size: file.size,
            uploaded: new Date()
        };

        try {
            const newFile = await File.create(fileRecord);
            file.mv(`./files/${filename}`, err => {
                if (err)
                    return res.status(500).send(err);

                res.json({
                    success: true,
                    message: "file uploaded!",
                    file: newFile
                })
            });
        } catch (e) {
            res.json({
                success: false,
                message: e.message
            })
        }
    }

    static async getFiles (req, res) {
        const list_size = req.query.list_size || 10;
        const page = req.query.page || 1;

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
                where: {},
                ...paginate({page, list_size})
            });

            res.json({
                success: true,
                data: files
            })
        } catch (e) {
            res.json({
                success: false,
                message: e.message
            })
        }

    }

    static async deleteFile (req, res) {
        const {id} = req.params;

        try {
            const file = await File.findOne({
                where: {id}
            });

            const deleteFileRecord = (err) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: err.message
                    });
                }

                File.destroy({
                    where: {id}
                });
                res.json({
                    success: true,
                    message: "file deleted!",
                })
            };

            fs.unlink(file.path, deleteFileRecord);
        } catch (e) {
            res.json({
                success: false,
                message: e.message
            })
        }
    }

    static async getFileById (req, res) {
        const {id} = req.params;

        try {
            const file = await File.findOne({
                where: {id}
            });

            if (file) {
                res.json({
                    success: true,
                    file
                })
            } else {
                res.sendStatus(404);
            }

        } catch (e) {
            res.json({
                success: false,
                message: e.message
            })
        }
    }

    static async downloadFile (req, res) {
        const {id} = req.params;

        try {
            const file = await File.findOne({
                where: {id}
            });

            if (file) {
                res.download(file.path);
            } else {
                res.sendStatus(404);
            }

        } catch (e) {
            res.json({
                success: false,
                message: e.message
            })
        }
    }

    static async updateFile (req, res) {
        const {file} = req.files;
        const {id} = req.params;
        const filename = `${req.user.id}-${new Date().toISOString()}-${file.name}`;
        const fileRecord = {
            path: `./files/${filename}`,
            name: filename,
            extension: path.extname(filename),
            mime: file.mimetype,
            size: file.size,
            uploaded: new Date()
        };

        const updateFile = async (err) => {
            if (err) {
                return res.json({
                    success: false,
                    message: err.message
                });
            }
            try {
                const newFile = await File.update(fileRecord, {
                    where: {id}
                });
                file.mv(`./files/${filename}`, err => {
                    if (err)
                        return res.status(500).send(err);

                    res.json({
                        success: false,
                        message: `${newFile[0]} file updated!`,
                    });
                });
            }catch (e) {
                return res.json({
                    success: false,
                    message: e.message

                });
            }

        };

        try {
            const oldFile = await File.findOne({
                where: { id }
            });
            if(!oldFile){
                res.sendStatus(404)
            }
            fs.unlink(oldFile.path, updateFile);
        } catch (e) {
            res.json({
                success: false,
                message: e.message
            })
        }
    }

}


module.exports = Files;