//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const req = require('express/lib/request');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const PORT = 3000;

let items = [];
let workItems = [];



app.get('/', (req,res) => {
    let options = {weekday:'long', day: 'numeric', month: 'long'};
    let day = new Date().toLocaleDateString('en-US', options);
    res.render(__dirname + '/views/list', {day: day, items: items});
});

app.post('/', (req,res) => {
    let listItem = req.body.listItem;
    if(req.body.router === 'Work'){
        workItems.push(listItem);
        res.redirect('/work');
    }else{
        items.push(listItem);
        res.redirect('/');  
    }     
});

app.get('/work', (req,res) => {
    res.render(__dirname + '/views/list', {day: 'Work', items: workItems});
});



















app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
