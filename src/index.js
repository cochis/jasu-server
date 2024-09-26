const express = require("express");
const app = express();
const cors = require('cors');
const path = require('path')
require('./database');

app.use(cors());
app.use(express.json());
app.use('/', express.static('client', { redirect: false }))
app.use('/api', [
    require('./routes/UserController'), 
    require('./routes/ContactController'), 
    require('./routes/FruitController'),
    require('./routes/BlogController'),
    require('./routes/PresentationController')
]);

app.get('*', function (req, res, next) {
    res.sendFile(path.resolve('client/index.html'))
  })
app.listen(3000);
console.log("Server on port", 3000);