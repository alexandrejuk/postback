require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const Port = process.env.PORT || 3003
const app = express()
const router = express.Router()
const axios = require('axios')

// db connection
const dburl = 'mongodb://sandbox:sandbox123*@ds115219.mlab.com:15219/sandbox'
mongoose.connect(dburl, { useNewUrlParser: true })

// schema mongodb
const postbackSchema = new mongoose.Schema({
  id: Number,
  event: String,
  old_status: String,
  desired_status: String,
  current_status: String,
  object: String,
  transaction: {
    status: String,
    amount: Number,
  },
  signature: String,
})

var Postback = mongoose.model('Postback', postbackSchema)


app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// routes
app.use('/api', router.post('/postback', async (req, res) => {
  const postbackSave = await Postback.create(req.body)
  res.json(postbackSave)
}))

app.use('/api', router.get('/postback', (req, res) => {
  Postback.find({})
    .then(postbacks => res.json(postbacks))
}))

app.use('/api', router.get('/signature/:transactionId', (req, res) => {
  axios.get(`https://api.pagar.me/1/transactions/${req.params.transactionId}/postbacks?api_key=${process.env.API_KEY_PAGARME}`)
    .then(response => {
      res.json(response.data)
    })
}))

app.listen(Port, () => console.log('running...'))
