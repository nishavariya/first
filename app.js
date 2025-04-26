const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const client = new MongoClient('mongodb://localhost:27017');

client.connect()
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.log(error);
});

const db = client.db('card');
const collection = db.collection('cdmi');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const allData = await collection.find().toArray();
    res.render('index', { allData});
});

app.get('/form',async(req, res) => {
    const allData = await collection.find().toArray();
    res.render('form',{allData,editData:null}); 
});

app.post('/dataCreate', async (req, res) => {
    const { id, ProductName, ProductCode ,ProductPrise } = req.body;

    if (id) {
        await collection.updateOne({ _id: new ObjectId(id) },{ $set: { ProductName, ProductCode ,ProductPrise} });
        console.log("Data updated");
    } else {
        await collection.insertOne({   ProductName, ProductCode ,ProductPrise });
        console.log("Data inserted");
    }

    res.redirect('/');
});



app.get('/deleteData/:id',async(req,res)=>{
    const deleteId  =req.params.id
    await collection.deleteOne({_id:new ObjectId(deleteId)})
    res.redirect('/')
})
app.get('/editData/:id', async (req, res) => {
    const editId = req.params.id;
    const editData = await collection.findOne({ _id: new ObjectId(editId) });
    const allData = await collection.find().toArray();
    res.render('form', { allData, editData });
});




app.listen(3000);
