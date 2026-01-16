const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err))

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

const User = mongoose.model('pbookuser', userSchema)

app.get('/', (req, res) => {
    res.json({ message: 'Update database' })
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body

    try {
        const newUser = new User({ username, password })
        await newUser.save()
        res.status(201).json({ message: 'User registered successfully' })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        res.status(400).json({ error: 'Error registering user', err: error.message })
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username })
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' })
        }
        res.json({ message: 'Login successful', user: { username: user.username, password: user.password } })
    } catch (error) {
        res.status(500).json({ error: 'Error during login', err: error.message })
    }
})

module.exports = app