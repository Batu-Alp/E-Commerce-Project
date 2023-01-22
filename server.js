const express = require("express");
const path = require('path');
var bodyParser = require('body-parser');
const db = require("./routes/database");
const session = require('express-session');
const { request } = require("http");
const { response } = require("express");

const app = express();

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, './public')))
app.use(bodyParser.urlencoded({extended : true}));
app.use(session({secret : "secret"}));

const port = 3000;
/*
var initial_quantity = db.query("SELECT * FROM products", (err, result) => {
    response.render("index",  { result : result});
    console.log(result);
})*/

function isProductInCart(cart, id) {

    for(let i = 0; i < cart.length; i++) {
        if (cart[i].id == id){
            return true;
        }
    }

    return false;
}

function calculateTotal(cart, request) {
    total = 0;
    for(let i = 0; i < cart.length; i++){
        // if we offering a discount
        /*if (cart[i].sale_price) {
            total = total + (cart[i].price * cart[i]* quantity);
        }*/
        total = total + (cart[i].price * cart[i].quantity)
        
    }

    request.session.total = total;
    return total;
}
app.get('/', (request,response) => {
    //response.render("index", { pageTitle : '--Welcome'});
    /*db.query("SELECT * FROM products", (err, result) => {
        response.render("index",  { result : result});
        console.log(result);
    })*/
    
    response.render("index", { pageTitle : '--Welcome'});

})

app.get('/login', (request, response) => {

    response.sendFile(path.join(__dirname, './public/login.html'));

})

app.get('/register', (request, response) => {

    response.sendFile(path.join(__dirname, './public/login.html'));

})

app.get('/products', (request, response) => {

    db.query("SELECT * FROM products", (err, result) => {
        response.render("products",  { result : result});
        console.log(result);
    })
})

app.post('/buy', (request, response) => {

    var id = request.body.id;
    var name = request.body.name;
    var price = request.body.price;
    var quantity = request.body.quantity;
    var product = {id :id, name : name, price : price, quantity : quantity};

    if (request.session.cart) {

        var cart = request.session.cart;
        if (!isProductInCart(cart, id)) {
            cart.push(product);
        }
    }

    else {
            request.session.cart = [product];
            var cart = request.session.cart;
        }

    calculateTotal(cart, request);
    response.redirect('/cart');
    

});

app.get('/cart', (request, response) => {

    var cart = request.session.cart;
    var total = request.session.total;

    response.render('cart', {cart : cart, total : total});
    
});

app.post('/remove', (request, response) => {

    var id = request.body.id;
    var cart = request.session.cart;

    for(let i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
            cart.splice(cart.indexOf(i), 1);
            /*db.query("UPDATE products SET quantity = quantity - ? WHERE id = ?", [1, cart[i].id ], (err, result) => {
                //response.render("products",  { result : result});
                console.log(result);
            })*/

        }
    }

    calculateTotal(cart, request);
    response.redirect('/cart')

});

var initial_quantity;

app.post('/edit_product_quantity', (request, response) => {

    var id = request.body.id;
    var quantity = request.body.quantity;
    var increase_btn = request.body.increase_product_quantity;
    var decrease_btn = request.body.decrease_product_quantity;
    var cart = request.session.cart;
    db.query("SELECT quantity FROM products WHERE id = ?", [id], (err, result) => {
        //console.log("result : ", result);
        //console.log("result : ", result[0].quantity);
        initial_quantity = result[0].quantity;

    });

    if (increase_btn) {
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].id == id) {

                //console.log(cart[i].quantity);
                console.log("initial_quantity : " + initial_quantity);

                if ( initial_quantity < 2) {
                    console.log("No Stock");
                    //console.log("cart[i].quantity " + cart[i].quantity);
                    //console.log("initial_quantity " + initial_quantity);

                }
                else if (cart[i].quantity > 0) {
                    cart[i].quantity = parseInt(cart[i].quantity) + 1;
                    db.query("UPDATE products SET quantity = quantity - ? WHERE id = ?", [1, cart[i].id ], (err, result) => {
                        //console.log(result);
                    })
                }
            }
            
        }
    }

    if (decrease_btn) {
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].id == id) {

           
                if (cart[i].quantity > 1) {
                    cart[i].quantity = parseInt(cart[i].quantity) - 1;
                    db.query("UPDATE products SET quantity = quantity + ? WHERE id = ?", [1, cart[i].id ], (err, result) => {
                        console.log(result);
                    })
                }
            }
            
        }
    }

    calculateTotal(cart, request);
    response.redirect('/cart');

})


app.use("/api", require("./controllers/auth"))


app.listen(port, () => {
    console.log(`Server port is :  ${port}`);
});