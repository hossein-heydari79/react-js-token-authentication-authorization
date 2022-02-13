require('dotenv').config()

const express = require('express')
const cors = require('cors');
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())
app.use(cors());

const products = [
  { id: 1, name: "Mouse" },
  { id: 2, name: "Monitor" },
  { id: 3, name: "Keyboard" },
  { id: 4, name: "Mobile" },
  { id: 5, name: "Tablet" },
  { id: 6, name: "Speaker" },
  { id: 7, name: "Handsfree" },
  { id: 8, name: "Adaptor" },
  { id: 9, name: "Battery" },
  { id: 10, name: "Case" },
]


app.get('/products', authenticateToken, (req, res) => {
  res.json(products)
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.listen(5000)