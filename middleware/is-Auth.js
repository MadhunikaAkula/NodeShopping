module.exports= (req, res, next) => {
    if (!req.session.islogged) {
        console.log("coming to middleware")
        return res.redirect('/login')
    }
    next();
}
