const fs = require('fs')

const logMessage = (type, msg) => {
    const date = new Date()
    const formattedDate = date.toLocaleString()
    const message = formattedDate + ' ; ' + msg.replace(/(\r\n|\n|\r)/gm," / ")
    const isDev = (process.env.NODE_ENV === 'development')
    let file

    switch(type) {
        case 'Error':
            file = './logs/error.log'
            break
        case 'Event':
            file = './logs/event.log'
            break
        case 'Request':
            file = './logs/request.log'
            break
        default :
            file = '/log/no-type-specified.log'
    }

    fs.appendFile(file, message + '\n', (err) => {
        if (err && isDev) {
            console.log(`Erreur d'écriture dans le fichier log (${err})`)
            return
        }
        if(isDev) console.log(`[${type}] ${message}`)
    })
}

const addError = (msg) => logMessage('Error', msg)
const addEvent = (msg) => logMessage('Event', msg)
const addRequest = (msg) => logMessage('Request', msg)

module.exports = {addError, addEvent, addRequest}