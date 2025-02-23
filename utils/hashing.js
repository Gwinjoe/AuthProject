const {hash} = require("bcryptjs");

exports.dohash = (value, saltValue) => {
    const result = hash(value, saltValue);
    return result;
}
