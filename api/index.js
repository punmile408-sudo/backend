const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
require('dotenv').config()

app.use(express.json())
app.use(cors())

let isConnected = false
const connectDB = async () => {
    if (isConnected) return
    try {
        await mongoose.connect(process.env.MONGO_URL);
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('DB Connection Error:', err);
    }
}

app.use(async (req, res, next) => {
    await connectDB()
    next()
})

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

const User = mongoose.models.User || mongoose.model('User', UserSchema);

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body

    try {
        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const newUser = new User({ username, password })
        await newUser.save()

        res.status(201).json({
            message: 'User registered successfully!',
            user: { username: newUser.username, password: newUser.password }
        })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.messages })
    }
})

app.get('/', (req, res) => res.send('API is running...'));

module.exports = app;