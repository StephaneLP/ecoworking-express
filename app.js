const express = require('express')
const app = express()
const port = 3000
const routeCity = require('./routes/city')

/*********************************************************
Requête : log date
*********************************************************/

app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

/*********************************************************
Route Ville
*********************************************************/

app.use('/ville/', routeCity)

/*********************************************************
Ouverture du port
*********************************************************/

app.listen(port, () => {
    console.log(`L'application est démarrée sur le port ${port}`)
}) 




/*

//////////////////////////////////////////////
// FONCTIONS
//////////////////////////////////////////////

const isInt = (id) => {
    const numbers = ['0','1','2','3','4','5','6','7','8','9']
    let res = true

    for (let val of id) {
        if (!numbers.includes(val)) return false
    }

    return res
}

const logURL = (req, res, next) => {
    console.log('Request URL : ', req.originalUrl)
    next()
}

const logMETHOD = (req, res, next) => {
    console.log('Request METHOD : ' + req.method)
    next()
}

//////////////////////////////////////////////
// ROUTE '/'
//////////////////////////////////////////////

const resGet = (req, res) => {
    const rep = 'ROUTE \'/\' - METHODE GET'
    res.send(rep)
    console.log(rep)
}

const resPOST = (req, res) => {
    const rep = 'ROUTE \'/\' - METHODE POST'
    res.send(rep)
    console.log(rep)
}

//////////////////////////////////////////////
// ROUTE '/:id'
//////////////////////////////////////////////

const resGetIdIsInt = (req, res) => {
    const rep = 'ROUTE \'/' + req.params.id + '\' - METHODE GET : Id est un entier positif'
    res.send(rep)
    console.log(rep)
}

const resGetIdIsNotInt = (req, res) => {
    const rep = 'ROUTE \'/' + req.params.id + '\' - METHODE GET : Id n\'est pas un entier positif'
    res.send(rep)
    console.log(rep)
}

//////////////////////////////////////////////
// ROUTE '/:id1/:id2'
//////////////////////////////////////////////

const checkId = (req, res, next) => {
    console.log('Check type du paramètre Id : ' + typeof req.params.id)
    isInt(req.params.id) ? next() : next('route')
}

//////////////////////////////////////////////
// ROUTAGE
//////////////////////////////////////////////

app.use(logURL, logMETHOD)

// Route '/'

app.route('/')
    .get(resGet)
    .post(resPOST)

// Route '/:id'

    app.get('/:id', checkId, resGetIdIsInt)
    app.get('/:id', resGetIdIsNotInt)

// Route '/:id1:id2'

app.get('/:id1/:id2', (req, res) => {
    console.log("GET : " + req.params.id1 + '/' + req.params.id2)
    res.send('DOUBLE GET METHOD')
})

*/
