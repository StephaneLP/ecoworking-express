const {stringAsInteger, stringAsBoolean} = require('../../utils/tools')

/*********************************************************
PARAMETRE PASSÉ PAR L'URL : PATH PARAM (URI PARAM)
*********************************************************/

const checkURIParam = (pathParam, columns) => {

    if (!pathParam || !pathParam.column || !pathParam.op || !pathParam.value) {
        return {success: false, msg: `La chaîne PathParameter est vide/incomplète`}
    }
    try {
        const constraint = columns[pathParam.column]
        const dataType = constraint.type

        switch (dataType) {
            case 'integer':
                if (!stringAsInteger(pathParam.value)) {
                    return {success: false, method: 'checkURIParam', msg: `URI Param : Erreur type de donnée (colonne '${pathParam.column}', type 'integer' attendu)`}
                }
                break
            case 'string':
                if (pathParam.value.length > constraint.length) {
                    return {success: false, method: 'checkURIParam', msg: `URI Param : Erreur longueur (colonne '${pathParam.column}', longueur max : ${constraint.length})`}
                }
                break
        }

        return {success: true}
    }
    catch(err) {
        throw new Error(`checkURIParam - ${err.name} (${err.message})`)
    }
}

/*********************************************************
PARAMETRES PASSÉS PAR L'URL : QUERY STRING
*********************************************************/

const checkValue = (constraints, column, value) => {
    switch (constraints.type) {
        case 'integer':
            if (!stringAsInteger(value)) {
                return `STRING Param : Erreur type de donnée (colonne '${column}', type 'integer' attendu)`
            }
            break
        case 'string':
            if (value.length > constraints.length) {
                return `STRING Param : Erreur longueur (colonne '${column}', string longueur max : ${constraints.length})`
            }
            break
        case 'boolean':
            if (!stringAsBoolean(value)) {
                return `STRING Param : Erreur type de donnée (colonne '${column}', type 'boolean' attendu)`
            }
            break
    }
    return false
}

const checkQueryString = (queryStringParams, columns) => {
    try {
        if(queryStringParams) {
            let constraints, values, msg

            for (let param of queryStringParams) {
                constraints = columns[param.column]

                if (param.op === 'IN') {
                    values = param.value.split(',')
                    for (let value of values) {
                        msg = checkValue(constraints, param.column, value)
                        if (msg) return {success: false, method: 'checkQueryString', msg: msg}                        
                    }
                }
                else {
                    msg = checkValue(constraints, param.column, param.value)
                    if (msg) return {success: false, method: 'checkQueryString', msg: msg}
                }
            }
        }

        return {success: true}
    }
    catch(err) {
        throw new Error(`checkQueryString - ${err.name} (${err.message})`)
    }
}

// POUR BODY :

// const nullAutorized = constraint.nullAutorized
// const emptyAuthorized = constraint.emptyAuthorized

// if ((dataType === 'string' && pathParam.value.lenght == 0 )|| pathParam.value == null) {
//     return {success: false, method: 'checkURIParam', msg: `URI Param : Erreur valeur (colonne '${pathParam.column}', 'null', 'undefined' et chaine vide non authorisés)`}
// }

module.exports = {checkURIParam, checkQueryString}