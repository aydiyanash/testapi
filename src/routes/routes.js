import auth from "../controllers/auth"

const routes = (app, middleware) => {

    app.post('/signin', auth.signIn);
    app.post('/signup', auth.signUp);
    app.post('/signin/new_token', [middleware.checkToken, auth.newToken]);


    app.get("/", middleware.checkToken, (req, res) => {
        res.json({
            success: true,
            message: 'Welcome home!'
        });
    });


};

export default {
    routes
}
