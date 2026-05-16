const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')
const path = require('path')

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/check', (req, res) => {
    res.send("This is Working...")
})

app.listen(port, () => {
    console.log(`Click To Continue http://localhost:${port}`)
})