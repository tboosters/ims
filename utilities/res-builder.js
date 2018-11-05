function build(msg, data="") {
    let body = {
        "msg": msg,
        "data": data
    };

    return body;
}

module.exports.build = build;