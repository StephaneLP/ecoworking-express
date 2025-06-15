const express = require('express')
const serveFavicon = require('serve-favicon')
const log = require('./src/utils/log')

const app = express()

/*********************************************************
Middlewares
*********************************************************/

app.use(serveFavicon(__dirname + '/favicon.png'))

/*********************************************************
Middlewares spécifiques à l'environnement de développement
*********************************************************/

if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan')

  app
    .use(morgan('dev'))
}

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

const port = process.env.PORT || 3000

app.listen(port, () => {
  log.addEvent(`L'application est démarrée sur le port ${port}`)
})
