import express from 'express';
import {add, sayHello} from './test';
// import * as test from './test';

const app = express();

console.log(sayHello('Kai'), add(10,20));
// console.log(test.sayHello('Kai'), test.add(10,20));


app.get('/', (req, res) =>{
    res.send('Hello World!');
});

app.listen(3000, ()=>{
    console.log('server is running on port 3000!');
})