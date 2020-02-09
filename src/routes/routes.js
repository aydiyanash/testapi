import auth from "../controllers/auth"
import files from "../controllers/files"

const fileUpload = require("express-fileupload");


const routes = (app, middleware) => {

    // auth routes
    app.post('/signin', auth.signIn);
    app.post('/signup', auth.signUp);
    app.post('/signin/new_token',[middleware.returnToken, auth.newToken]);

    app.get('/logout', auth.logOut);
    app.get('/info', auth.getInfo);

    //files routes
    app.post('/file/upload',[fileUpload(), files.upload]);

    app.get('/file/list', files.getFiles);
    app.get('/file/:id', files.getFileById);
    app.get('/file/download/:id', files.downloadFile);

    app.put('/file/update/:id', [fileUpload(), files.updateFile]);

    app.delete('/file/delete/:id', files.deleteFile)
};

export default {
    routes
}
