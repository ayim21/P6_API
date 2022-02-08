const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({path: './config/.env'});


//Pour se connecter à la BDD MongoDB
mongoose.connect("mongodb+srv://" + process.env.DB_USER_PASS + "@cluster0.yfzgx.mongodb.net/projetsix?retryWrites=true&w=majority", 
  {
    useNewUrlParser : true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Succeeded to connect to MongoDB'))
  .catch(() => console.log('Failed to connect to MongoDB'));

  
const path = require('path');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');


const app = express();
app.use(express.json());

//CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;
