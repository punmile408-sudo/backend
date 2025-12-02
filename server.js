const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({ origin: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'Server can run from punmile' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Server running on port ' + PORT))