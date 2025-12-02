const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/User')
const app = express()

app.use(cors({ origin: true }))
app.use(express.json())

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.get('/users', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.get('/', (req, res) => {
    res.json({ message: 'Server can run from punmile' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Server running on port ' + PORT))