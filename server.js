const express = require("express");
const path = require('path');
var bodyParser = require('body-parser');
const db = require("./routes/database");

const app = express();

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, './public')))
app.use(bodyParser.urlencoded({extended : true}));

const port = 3000;

app.get('/', (request,response) => {
    //response.render("index", { pageTitle : '--Welcome'});
    db.query("SELECT * FROM products", (err, result) => {
        response.render("index",  { result : result});
        console.log(result);
    })

})

app.listen(port, () => {
    console.log(`Server port is :  ${port}`);
});