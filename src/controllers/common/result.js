const log = require('../../utils/log')
const {isParent, hasChildren} = require('../../config/db.params')

/*********************************************************
MISE EN FORME DE LA RÉPONSE DE LA REQUÊTE
*********************************************************/

const formatResponse = (params, dbRes) => {
    const mainTable = params.tables.mainTable
    const joinTables = params.tables.joinTables
    const mainTableName = mainTable[0].tableName
    const arrResult = [], mainStack = [], joinStack = {}
    let joinTableName, datas, mainBuildKey, joinBuildKey, key, lineTemp = {}

    // Initialisation de la pile contenant les données jointes (tables enfant) déjà ajoutées
    for (let table of joinTables) {
        if (isParent(mainTableName, table[0].tableName)) joinStack[table[0].tableName] = []
    }

    for (let line of dbRes) {
        // Récupération de la clé buildKey dans la réponse dbRes (undefined si absente)
        mainBuildKey = line[mainTableName].buildKey

        // Les données de la mainTable ont déjà été ajoutée à la réponse
        if (mainStack.includes(mainBuildKey)) {
            // Parcours des données des tables jointes
            for (let table of joinTables) {
                joinTableName = table[0].tableName
                joinBuildKey = line[joinTableName].buildKey

                // La table jointe est enfant et les données n'ont pas encore été ajoutées
                if (joinBuildKey && !joinStack[joinTableName].includes([mainBuildKey, joinBuildKey].join())) {
                    key = arrResult.findIndex((el) => el['buildKey'] === mainBuildKey)
                    lineTemp = {...line[joinTableName]}
                    delete lineTemp.buildKey
                    arrResult[key][joinTableName].push(lineTemp)
                    joinStack[joinTableName].push([mainBuildKey, joinBuildKey].join())
                    lineTemp = {}
                }
            }
        }
        // Les données de la mainTable n'ont pas encore été ajoutés à la réponse
        else {
            datas = {...line[mainTableName]}
            mainStack.push(mainBuildKey)

            // Parcours des données des tables jointes
            for (let table of joinTables) {
                joinTableName = table[0].tableName
                joinBuildKey = line[joinTableName].buildKey

                if (joinBuildKey === null) continue
                if (!isParent(mainTableName, joinTableName)) {
                    datas[joinTableName] = {...line[joinTableName]}
                }
                else {
                    datas[joinTableName] = [{...line[joinTableName]}]
                    joinStack[joinTableName].push([mainBuildKey, joinBuildKey].join())
                    delete datas[joinTableName][0].buildKey
                }
            }

            arrResult.push(datas)
        }

        datas = {}
    }

    // Suppression des clés buildKey
    arrResult.forEach(line => delete line.buildKey)

    return arrResult
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