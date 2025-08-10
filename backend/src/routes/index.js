const authRoute = require('./auth.route');

function route(app) {
    app.use('/user', authRoute);
}

module.exports = route;