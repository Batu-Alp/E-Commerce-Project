const express = require('express');
const router = express.Router();
const db = require("../routes/database");

db.connect((err) => {

    if (err) throw err;
})

router.get('/', (request, response) => {
    response.render('index', {pageTitle : ' -Welcome'});
});

router.get("/register", (request, response) => {
    response.sendFile("register.html", {  root : "./public"});
})

router.get("/login", (request, response) => {
    response.sendFile("login.html", {root : "./public"});
})

/*
router.get('/products', function(req, res, next) {
      
    connection.query('SELECT * FROM products',function(err,rows)     {
    
           if(err){
            req.flash('error', err); 
            res.render('shopping',{page_title:"Users - Node.js",data:''});   
           }else{
               
               res.render('shopping',{page_title:"Users - Node.js",data:rows});
           }
                               
            });
           
       });
       */
/*
router.get("/products", (request, response) => {
    db.execute("SELECT * FROM products").then(
        result => {
            console.log(result[0]);

            response.render("index", {
                products : result[0]
            });
        }
    ).catch(err => console.log(err));
   
})*/


module.exports = router;