let { expressjwt: jwt } = require("express-jwt");
const { get } = require("mongoose");

function expressjwt() {
    // console.info("JWT")
    // const secretKey = process.env.JWT_SECRET
    // return jwt({ secret: secretKey, algorithms: ["HS256"] }),
    //     function (req, res) {
    //         console.info("Check me")
    //         if (req.headers.authorization &&
    //             req.headers.authorization.split(" ")[0] === "Bearer") {

    //             return res.sendStatus(401);
    //         }
    //         res.sendStatus(200);
    //     }
    console.log("JWT");
    const secretKey = process.env.JWT_SECRET
    return jwt({
        secret: secretKey,
        algorithms: ["HS256"],
        credentialsRequired: false,
        getToken: function fromHeaderOrQuerystring(req) {
            console.info("Calling getToken >>>> ")
            if (
                req.headers.authorization &&
                req.headers.authorization.split(" ")[0] === "Bearer"
            ) {
                return req.headers.authorization.split(" ")[1];
            } else if (req.query && req.query.token) {
                return req.query.token;
            }
            return null;
        },
    })
    // .unless({
    //     path: [
    //         // { url: "/product", methods: ["GET", "OPTIONS"] },
    //         "/categoty"
    //     ]
    // })
}
module.exports = expressjwt