const authRouter = require("./auth");
const campaignRouter = require("./campaign");

function route(app) {
    app.use("/api/auth", authRouter);
    app.use("/api/campaign", campaignRouter);
}

module.exports = route;