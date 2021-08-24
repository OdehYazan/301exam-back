'use strict'
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose')
require('dotenv').config();
const server = express();
server.use(cors());
server.use(express.json());

const port = process.env.PORT

mongoose.connect('mongodb://localhost:27017/flowers', { useNewUrlParser: true, useUnifiedTopology: true });

const flowerSchema = new mongoose.Schema({
    email: String,
    instructions: String,
    photo: String,
    name: String
})

const flowerModel = new mongoose.model('flower', flowerSchema)

server.get('/getApiData', getApiFun)
server.post('/AddToFav/:email', addToDb)
server.get('/GetFav/:email', getFromDb)
server.delete('/Delete/:email/:id', deleteFun)
server.put('/Update/:email/:id', updateFun)
function getApiFun(req, res) {
    axios.get(`https://flowers-api-13.herokuapp.com/getFlowers`).then(result => {
        // console.log(result.data.flowerslist);
        let flowerArray = result.data.flowerslist.map(item => {
            return new Flower(item)

        })
        // console.log(flowerArray);
        res.send(flowerArray)
    })
}

class Flower {
    constructor(data) {
        this.instructions = data.instructions;
        this.photo = data.photo;
        this.name = data.name;
    }
}

function addToDb(req, res) {
    console.log(req.body);
    console.log(req.params);
    const flowerData = new flowerModel({
        email: req.params.email,
        instructions: req.body.instructions,
        photo: req.body.photo,
        name: req.body.name
    })
    flowerData.save()
}

function getFromDb(req, res) {
    const userEmail = req.params.email;
    flowerModel.find({ email: userEmail }, (error, data) => {

        res.send(data)
    })
}

function deleteFun(req, res) {
    const { id, email } = req.params;
    flowerModel.deleteOne({ _id: id }, (error, data) => {
        flowerModel.find({ email: email }, (error, data) => {

            res.send(data)
        })
    })
}

function updateFun(req, res) {
    console.log(req.body);
    console.log(req.params);
    const { id, email } = req.params;
    const { instructions, photo, name } = req.body;
    flowerModel.findOne({ _id: id }, (error, data1) => {

        console.log(data1);
      
           
           data1.instructions=instructions;
          data1.photo=photo;
          data1.name=name;
          
    })
    flowerModel.save()
}
server.listen(port, () => {
    console.log(`listening ${port} `);
})