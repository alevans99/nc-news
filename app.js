const express = require("express");
const apiRouter = require("./routes/api-router");
const {
    handle500Errors,
    handleCustomErrors,
} = require("./controllers/error-controllers");
const {
    connected
} = require("./utils");
const connectedRouter = require("./routes/connected-router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use("/", connectedRouter)

//Anything not routed through /api returns an error
app.all("/*", (req, res) => {
    res.status(404).send({
        message: "path not found"
    });
});

app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;
