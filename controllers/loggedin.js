const connection = require("../routes/database")
const loggedIn = (req, res, next) => {
    
    if (!req.cookies.userRegistered) return next();
    try {
        const decoded = jwt.verify(req.cookies.userRegistered, process.env.JWT_SECRET);
        connection.query('SELECT * FROM users WHERE id = ?', [decoded.id], (err, result) => {
            if (err) return next();
            req.user = result[0];
            return next();
        })
    }
    catch (err) {
        if (err) return next();

    }
}

module.exports = loggedIn