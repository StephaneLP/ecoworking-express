const fs = require('fs')

// fs.open('log.txt', 'w', function (err) {   
//         if (err) throw err
//         console.log('Le fichier log est ouvert')
//     })

const log = (msg) => {
    fs.appendFile('./data/error.log', msg + '\n', function (err) {
        if (err) throw err
        console.log('Fichier log mis à jour')
    })
}

module.exports = log