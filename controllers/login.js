// 42.39 dakika da kaldım 
// https://www.youtube.com/watch?v=zofORFv0K5g&t=1294s

const jwt = require("jsonwebtoken");
const connection = require("../routes/database");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {

    const {email, password} = req.body;
    console.log(req.body);
    /*if (!email || !password) {
        return res.json({status : "error", error : "Plsease Enter your email and password"});
    }*/
    if (!email || !password) return res.json({status : "error", error : "Plsease Enter your email and password"});
    

    else {
        connection.query('SELECT * FROM users WHERE email = ?', [email], async (Err, result) => {
            if (Err) throw Err;
            if (!result[0] || !await bcrypt.compare(password, result[0].password)) return res.json({ status : "error", error : "Incorrect email or password"})
            else {
                const token = jwt.sign({id : result[0].id }, process.env.JWT_SECRET, {
                    expiresIn : process.env.JWT_EXPIRES
                    //httpOnly : true

                })
                const cookieOptions = {
                    //expiresIn : process.env.COOKIE_EXPIRES,
                    expiresIn : new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly : true
                }
                res.cookie("userRegistered", token, cookieOptions);
                //res.cookie("userRegistered", cookieOptions);

                return res.json({status : "success", success : "User has been loggd in"});
                }
        })
    }
}

module.exports = login;