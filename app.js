//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const dateModule = require(__dirname + '/date.js');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 5000 }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true });

const taskSchema = mongoose.Schema({
    name : {
        type : String,
        required : [1, 'Enter a valid task']
    }
});

const itemSchema = mongoose.Schema({
    list : {
        type : String,
        required : [1, 'Enter a vaild list page']
    },

    items : [taskSchema]
});

const Item = mongoose.model('Item', itemSchema);


app.get('/', (req,res) => {
    let home = 'Welcome';
    Item.find({list : home},(err,items) => {
        if(!items.length){
            res.render(__dirname + '/views/list', {title: home, items: []});
        }else{
            items.forEach(item => {
                res.render(__dirname + '/views/list', {title: home, items: item.items});
            })
        }
    })
});

app.post('/', (req,res) => {
    let listItem = req.body.listItem;
    let page = req.body.router;

    let task = {
        name : listItem
    }

    let newList = new Item({
        list : page,
        items : [task]
    })

    if(page == 'Welcome'){
        Item.findOneAndUpdate({list: page},{$push: {items : task}}, (err,foundDoc)=> {
            if(!err)
                res.redirect('/'); 
        })       
    }else{
        Item.find({list: page},(err,foundDoc) => {
            if(!foundDoc.length){
                Item.create(newList, (err) => console.log(err));
            }else{
                Item.findOneAndUpdate({list: page},{$push: {items : task}}, (err,foundDoc)=> {
                    if(!err){
                        console.log('Updated');
                    }else{
                        console.log(err);
                    }
                })
            }
        })
        res.redirect('/' + page);
    }
});



app.get('/:custom',(req,res) =>{
    let page = req.params.custom;

    Item.find({list : page},(err,items) => {
        if(err){
            console.log(err)
        }else{
            if(!items.length){
                res.render(__dirname + '/views/list', {title: page, items: []});
            }else{
                items.forEach(item => {
                    res.render(__dirname + '/views/list', {title: page, items: item.items});
                });
            }   
        }
    })  
});

app.post('/delete', (req,res) => {
    let item = req.body.item;
    console.log(item);
    let page = req.body.router;
    let task = {
        name : item
    }
    Item.findOneAndUpdate({list: page},{$pull: {items: task}},(err,doc) => {
        if(page == 'Welcome'){
            res.redirect('/')
        }else{
            res.redirect('/' + page);
        }
    }) 
})


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
