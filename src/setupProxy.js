const proxy = require("http-proxy-middleware");

module.exports = function(app) {
    app.use(
        proxy("/api_task", {
            target: "http://127.0.0.1:18600",
            changeOrigin: true
        })
    );
};
