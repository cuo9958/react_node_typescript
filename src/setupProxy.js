const proxy = require("http-proxy-middleware");

module.exports = function(app) {
    app.use(
        proxy("/api_user", {
            target: "http://127.0.0.1:18620",
            changeOrigin: true
        })
    );
};
