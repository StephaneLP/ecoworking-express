const pool = mariadb.createPool({
    host: '127.0.0.1', 
    port: 3306,
    user: 'root', 
    password: '',
    database: 'ecoworking',
    connectionLimit: 5
})

pool.getConnection(function (err) {
    // Check if there is a connection error
    if (err) {
        console.log("connection error", err.stack);
        return;
    }

    // If there was no error, print this message
    console.log(`connected to database`);
});

// Expose a method to establish connection with MariaDB SkySQL
module.exports = Object.freeze({
  pool: pool
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
