
const connection = require("../routes/database");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
    const {email, password : Npassword} = req.body
    /*if (!email || !Npassword) {
        return res.json({status : "error", error : "Plsease Enter your email and password"});
    }*/
    if (!email || !Npassword) return res.json({status : "error", error : "Plsease Enter your email and password"});
    
    else {
        connection.query('SELECT email FROM users WHERE email = ?', [email], async (err, result) => {
            if(err) throw err;
            if (result[0]) return res.json({ status : "error", error : "Email has already been registered"})
            else {
                const password = await bcrypt.hash(Npassword, 8);
                console.log(password);
                connection.query('INSERT INTO users SET ?', {email : email, password : password}, (error, results) => {
                    if (error) throw error;
                    return res.json( {status : "success", success : "User has been registered"})
                })
            }
        })
    }

}

module.exports = register;