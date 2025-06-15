const express = require('express')
const serveFavicon = require('serve-favicon')

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
    .use((req, res, next) => {
      const date = new Date();
      const formattedDate = date.toLocaleString();
      console.log('Time : ', formattedDate)
      next()
    })
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
    console.log(`L'application est démarrée sur le port ${port}`)
})

const log = require('./src/utils/log')
log(`L'application est démarrée sur le port ${port}`)