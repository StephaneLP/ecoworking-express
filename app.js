const express = require('express')
const morgan = require('morgan')
const serveFavicon = require('serve-favicon')
const app = express()
const port = process.env.PORT || 3001
console.log(process.env.NODE_ENV)
/*********************************************************
Requête : log date
*********************************************************/

app
  .use(morgan('dev'))
  .use(serveFavicon(__dirname + '/favicon.png'))
  .use((req, res, next) => {
    const date = new Date();
    const formattedDate = date.toLocaleString();
    console.log('Time : ', formattedDate)
    next()
  })

/*********************************************************
Connexion BDD
*********************************************************/

require('./src/db/initdb.js')

/*********************************************************
Routes
*********************************************************/

const routeCity = require('./src/routes/city')
const routeEcoworking = require('./src/routes/ecoworking')

app.use('/ville/', routeCity)
app.use('/ecoworking/', routeEcoworking)

/*********************************************************
Ouverture du port
*********************************************************/

app.listen(port, () => {
    console.log(`L'application est démarrée sur le port ${port}`)
})

console.log('--------------- test ---------------------------')

const user = require('./src/tests/user.js');
console.log(user);

console.log('--------------- test ---------------------------')