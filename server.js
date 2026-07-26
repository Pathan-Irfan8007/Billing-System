const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const { MongoClient } = require('mongodb')
const cors = require('cors')
const path = require('path')
const XLSX = require('xlsx');


app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const url = process.env.MONGO_URL
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

app.post('/customer', async (req, res) => {
    try{

        const collection = await db.collection('customer')

        const customerData = {
            ...req.body,
            createdAt : new Date()
        }

        const result = await collection.insertOne(customerData)
        
        res.json({
            message : "Data Inserted Successfully",
            result : result
        })
    } catch (error) {
        res.status(500).json({
            message : "Error While inserting Data",
            error : error
        })
    }
})

app.get('/search/:date', async (req, res) => {

    try {

        const selectedDate = req.params.date;

        const start = new Date(selectedDate);
        const end = new Date(selectedDate);

        end.setDate(end.getDate() + 1);

        const collection = await db.collection('customer')

        const data = await collection.find({
            createdAt: {
                $gte: start,
                $lt: end
            }
        }).toArray()

        res.json(data);

    } catch (error) {

        res.status(500).json({
            message : error.message
        })

    }

});


app.get('/download-monthly-data', async (req, res) => {

    const month = req.query.month;

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);

    endDate.setMonth(endDate.getMonth() + 1);

    const collection = await db.collection('customer')

    const data = await collection.find({
        createdAt: {
            $gte: startDate,
            $lt: endDate
        }
    }).toArray();

    if(data.length === 0){
        return res.status(404).send(`
            <h1 style="font-size: 40px; text-align:center; margin-top:50px;">
                No records found for this month
            </h1>
        `);
    }

    const formattedData = data.map(item => ({
        Name: item.name,
        Mobile: item.mob,
        Product: item.product,
        Price: item.price,
        Payment: item.mode || item.payment,
        Date: new Date(item.createdAt).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Report");

    const buffer = XLSX.write(workbook, {
        type: 'buffer',
        bookType: 'xlsx'
    });

    res.setHeader(
        'Content-Disposition',
        `attachment; filename=${month}-report.xlsx`
    );

    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.send(buffer);
});

app.listen(port, () => {
    console.log(`Server Running On Port ${port}`)
    console.log(`http://localhost:${port}`)
})