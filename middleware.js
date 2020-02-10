let authorizationError = (err, req, res, next) => {
    if(err.name === 'UnauthorizedError') {
        res.status(err.status).send({status: err.status, message: err.message});
        return;
    }
    next();
};

module.exports = {
    authorizationError: authorizationError
};
