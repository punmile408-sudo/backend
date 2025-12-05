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

app.get('/', (req, res) => {
    res.json({ message: 'Server can run from punmile' })
})

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body

        const existingUsername = await User.findOne({ username })
        if (existingUsername) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const newUser = new User({ username, password })
        await newUser.save()
        res.status(201).json({ message: 'Sign Success', newUser })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: 'Server Error', error: err.message })
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Server running on port ' + PORT))