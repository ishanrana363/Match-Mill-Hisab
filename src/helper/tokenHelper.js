const jwt = require("jsonwebtoken")

const tokenCreate = (data, key, expiresIn) => {
    const token = jwt.sign(data, key, { expiresIn });
    return token;
};

module.exports = { tokenCreate };