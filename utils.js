exports.methodNotAllowed = (req, res) => {
    res.status(405).send({
        message: "Method Not Allowed"
    })
}

exports.connected = (req, res) => {

    res.status(200).send({
        message: "Connected"
    });
}
