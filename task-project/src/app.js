const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const hbs = require('hbs');

// Define paths for Express config
const publicDirPath = path.join(__dirname, './public');
const viewPath = path.join(__dirname, './templates');
const partialsPath = path.join(__dirname, './templates/partials');
const modelsPath = path.join(__dirname, './models');
const routesPath = path.join(__dirname, './routes');

// Model
const User = require( modelsPath + '/user-model');
const Task = require( modelsPath + '/task-model');
// DB connect 
mongoose.connect(process.env.MONGODB_URL,{
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

app.get('/', (req, res)=>{
    res.send('ok')
});

module.exports = app;

// Test
// const pet = {
//     name: "Lucky"
// }

// pet.toJSON = function(){
//     console.log('trigger!');
//     return pet;
// }

// console.log(JSON.stringify(pet));