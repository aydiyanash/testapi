let returnToken = (req, res, next) => {
    let token = req.headers['authorization'];
    token = token.replace("Bearer ","");
    res.token = token;
    next();
};

let authorizationError = (err, req, res, next) => {
    if(err.name === 'UnauthorizedError') {
        res.status(err.status).send({status: err.status, message: err.message});
        return;
    }
    next();
};

module.exports = {
    returnToken: returnToken,
    authorizationError: authorizationError
};
