const express = require('express')
const app = express()
const port = 5000
const { MongoClient } = require('mongodb')
const cors = require('cors')
const path = require('path')



app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

const dbName = "Billing-System"
let db

const connectDB = async () => {
    try{
        await client.connect()
        db = client.db(dbName)
        console.log("Database Connected Succefully.")
    }catch(error){
        console.log(`Something Went Wrong : ${error}`)
    }
}
connectDB()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/check', (req, res) => {
    res.send("This is Working...")
})

app.get('/customer', async (req, res) => {
    const collection = db.collection('customer')
    const customerData = await collection.find().toArray()
    res.json(customerData)
})

app.listen(port, () => {
    console.log(`Click To Continue http://localhost:${port}`)
})