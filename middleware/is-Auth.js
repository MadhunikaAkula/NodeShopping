module.exports= (req, res, next) => {
    if (!req.session.islogged) {
        return res.redirect('/login')
    }
    next();
}
