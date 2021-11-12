const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.cwknw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('tourismWebDb');
        const serviceCollection = database.collection('services');
        const ordarcollection = database.collection('ordars')
        // Get API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);

        });
        app.get('/ordars', async (req, res) => {
            const cursor = ordarcollection.find({});
            const ordars = await cursor.toArray();
            res.send(ordars);

        });

        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })
        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            // console.log(service)
            const result = await serviceCollection.insertOne(service);
            res.json(result)
        })

        app.post('/ordars', async (req, res) => {
            const ordar = req.body;
            // console.log('ordar',ordar);
            const result = await ordarcollection.insertOne(ordar);
            res.json(result)
        })
        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })
    } finally {
        // await client.close()
    }
}

run().catch(console.dir);


app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server site')
})
app.get('/hello', (req, res) => {
    res.send('hello from Server site')
})



app.listen(port, () => {
    console.log('server started')
})