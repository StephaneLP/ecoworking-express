const log = require('../../utils/log')
const {isParent} = require('../../config/db.params')

/*********************************************************
MISE EN FORME DE LA RÉPONSE DE LA REQUÊTE
*********************************************************/

const formatResponse = (params, dbRes) => {
    const mainTable = params.tables.mainTable
    const joinTables = params.tables.joinTables
    const mainTableName = mainTable[0].tableName
    let joinTableName, columns
    const arrResult = []
console.log('RES -> ', dbRes)


    for (let line of dbRes) {      
        
        

        
        columns = {...line[mainTableName]}
        for (let table of joinTables) {  
            joinTableName = table[0].tableName
            if (!isParent(mainTableName, joinTableName)) {
                columns[joinTableName] = {...line[joinTableName]}
            }
        }
        arrResult.push(columns)
        columns = {}
    }
 
    return arrResult
    // return dbRes
}

/*********************************************************
REPONSES RETOURNÉES AU CLIENT - LOG DES REQUÊTES ET ERREURS
*********************************************************/

const sendResult = (res, code, fct, message, nbRows, data) => {
    res.status(code).json({status: 'success', code: code, message: message, nb_rows: nbRows, data: data})
    log.addRequest(`Code : ${code} ; Fonction : ${fct} ; Message : ${message} (nb lignes: ${nbRows})`)
}

const sendError = (res, code, fct, frontMessage, logMessage) => {
    res.status(code).json({status: 'error', code: code, message: frontMessage})
    log.addError(`Code : ${code} ; Fonction : ${fct} ; Message : ${frontMessage} ${logMessage ? `(${logMessage})` : ''}`) 
}

module.exports = {formatResponse, sendResult, sendError}