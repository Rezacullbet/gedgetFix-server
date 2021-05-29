const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5555;

app.use(cors());
app.use(bodyParser.json());
console.log(process.env.DB_USER);

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v0opz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection err', err)
  const serviceCollection = client.db("gadgetFix").collection("services");
  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log('adding new service ', newService);
    serviceCollection.insertOne(newService)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })
  // perform actions on the collection object
  console.log('database connected successfully');

  app.get('/service', (req, res) => {
    serviceCollection.find()
    .toArray((err, items) => {
      res.send(items)
      console.log('from database ', items);
    })
  })
  
  // client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})