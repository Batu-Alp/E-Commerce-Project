const express = require("express");
const app = express();

const port = 3000;

app.get('/', (request,response) => {
    response.send("Demo_v1");

})

app.listen(port, () => {
    console.log(`Server port is :  ${port}`);
});