const log = require('./log')

const sendResult = (res, code, fct, message, nbRows, data) => {
    res.status(code).json({status: 'success', code: code, message: message, nb_rows: nbRows, data: data})
    log.addRequest(`Code : ${code} ; Fonction : ${fct} ; Message : ${message} (nb lignes: ${nbRows})`)
}

const sendError = (res, code, fct, frontMessage, logMessage) => {
    res.status(code).json({status: 'error', code: code, message: frontMessage})
    log.addError(`Code : ${code} ; Fonction : ${fct} ; Message : ${frontMessage} ${logMessage ? `(${logMessage})` : ''}`) 
}

module.exports = {sendResult, sendError}