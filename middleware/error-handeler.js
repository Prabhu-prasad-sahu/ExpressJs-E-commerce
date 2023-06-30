function errHandeler(err, req, rsp, next) {
    if (err.name === "UnauthorizedError") {
        return rsp.status(401).json({ message: "this user is not authorized" })
    }
    if (err.name === "ValidationError") {
        return rsp.status(401).json({ Message: err })
    }
    return rsp.status(500).json(err)
}