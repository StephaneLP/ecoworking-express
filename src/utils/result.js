const log = require('./log')

const sendResult = (res, code, fct, message, nbRows, data) => {
    res.status(code).json({status: 'success', code: code, message: message, nbRows: nbRows, data: data})
    log.addRequest(`Code : ${code} ; Fonction : ${fct} ; Message : ${message} (nb lignes: ${nbRows})`) 
}

const sendError = (res, code, fct, frontMessage, logMessage) => {
    console.log('STOP1')
    res.status(code).json({status: 'error', code: code, message: frontMessage})
    console.log('STOP')
    log.addError(`Code : ${code} ; Fonction : ${fct} ; Message : ${frontMessage} ${logMessage}`) 
}

module.exports = {sendResult, sendError}