const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const hbs = require('hbs');
const keys = require('../config/keys.js');
// const fs = require('fs');
const port = process.env.port || 3000;

// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../templates');
const partialsPath = path.join(__dirname, '../templates/partials');
const modelsPath = path.join(__dirname, '../models');
const routesPath = path.join(__dirname, '../routes');

// Model
const User = require( modelsPath + '/user-model');
const Task = require( modelsPath + '/task-model');

// DB connect 
mongoose.connect(keys.mongodb,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(
    ()=>{console.log('connected to mongodb');},
    err =>{console.log(err);}
);

// Setup Routes
const userRoutes = require( routesPath + '/user-routes');
const taskRoutes = require( routesPath + '/task-routes');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

// Setup static directory to server
app.use(express.static(publicDirPath));

// Setup handlebar engine and views location
app.set('view engine', 'hbs');
app.set('views', viewPath);

hbs.registerPartials(partialsPath);

// Routes
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

// Test
// const private_key = fs.readFileSync(publicDirPath + '/rs256-test/private.key', 'utf8');
// const public_key = fs.readFileSync(publicDirPath + '/rs256-test/public.pem', 'utf8');


app.get('/', (req, res)=>{
    res.send('ok')
});


app.listen(port, ()=>{
    console.log('listening onport 3000!')
});

const jwt = require('jsonwebtoken');

const fun = async ()=>{

    // const token = await jwt.sign({
    //     "_id": "test123",
    //     "password": "00001234"
    // }, private_key, {algorithm:'RS256'});

    const token = await jwt.sign({
            "_id": "test123",
            "password": "00001234"
        }, 'thisiskey')

    console.log("token:", token);

    const data = jwt.verify(token, 'thisiskey',{expiresIn: '12h'});
    console.log(data);
}

// fun();