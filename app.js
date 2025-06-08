const express = require('express')
const morgan = require('morgan')
const app = express()
const port = 3000

/*********************************************************
Requête : log date
*********************************************************/

app.use(morgan('dev'))

app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

/*********************************************************
Routes
*********************************************************/

const routeCity = require('./routes/city')
const routeEcoworking = require('./routes/ecoworking')

app.use('/ville/', routeCity)
app.use('/ecoworking/', routeEcoworking)

/*********************************************************
Ouverture du port
*********************************************************/

app.listen(port, () => {
    console.log(`L'application est démarrée sur le port ${port}`)
}) 

/*********************************************************
Connexion BDD
*********************************************************/

// const initdb = require('./db/initdb')

        // const conn = require('./db/connect')
        // console.log("STOP")
        // const rows = await conn.query('SELECT id FROM city');
        // console.log(rows)