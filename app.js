const express = require('express')
const serveFavicon = require('serve-favicon')
const log = require('./src/utils/log')
const app = express()
const {checkJSONSyntax} = require('./src/middlewares/parseJSON')

/*********************************************************
Middlewares
*********************************************************/

app.use(serveFavicon(__dirname + '/favicon.png'))
app.use(express.json())
app.use(checkJSONSyntax)

/*********************************************************
Middlewares spécifiques à l'environnement de développement
*********************************************************/

if (process.env.NODE_ENV === 'development') {
    const morgan = require('morgan')

    app.use(morgan('dev'))
}

/*********************************************************
Connexion BDD
*********************************************************/

require('./src/config/db.js')

/*********************************************************
Routes
*********************************************************/

const cityRoutes = require('./src/routes/city.routes.js')
const ecoworkingRoutes = require('./src/routes/ecoworking.routes.js')

app.use('/ville/', cityRoutes)
app.use('/ecoworking/', ecoworkingRoutes)

/*********************************************************
Ouverture du port
*********************************************************/

const port = process.env.PORT || 3000

app.listen(port, () => {
    log.addEvent(`L'application est démarrée sur le port ${port}`)
})
