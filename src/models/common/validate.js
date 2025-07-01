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
                pathParam.value = Number(pathParam.value)
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

const checkParam = (constraint, param) => {
    switch (constraint.type) {
        case 'integer':
            if (!stringAsInteger(param.value)) {
                return {success: false, method: 'checkQueryString', msg: `STRING Param : Erreur type de donnée (colonne '${param.column}', type 'integer' attendu)`}
            }
            param.value = Number(param.value)
            break
        case 'string':
            if (param.value.length > constraint.length) {
                return {success: false, method: 'checkQueryString', msg: `STRING Param : Erreur longueur (colonne '${param.column}', string longueur max : ${constraint.length})`}
            }
            break
        case 'boolean':
            if (!stringAsBoolean(param.value)) {
                return {success: false, method: 'checkQueryString', msg: `STRING Param : Erreur type de donnée (colonne '${param.column}', type 'boolean' attendu)`}
            }
            param.value = ['1', 'true'].includes(param.value.toLowerCase())
            break
    }
}

const checkQueryString = (queryStringParams, columns) => {
    try {
        if(queryStringParams) {
            let constraint, op

            for (let param of queryStringParams) {
                constraint = columns[param.column]
                op = param.op
                if (op === 'IN') {
                    
                }


console.log('op', op)
                checkParam(constraint, param)

                // switch (dataType) {
                //     case 'integer':
                //         if (!stringAsInteger(param.value)) {
                //             return {success: false, method: 'checkQueryString', msg: `STRING Param : Erreur type de donnée (colonne '${param.column}', type 'integer' attendu)`}
                //         }
                //         param.value = Number(param.value)
                //         break
                //     case 'string':
                //         if (param.value.length > constraint.length) {
                //             return {success: false, method: 'checkQueryString', msg: `STRING Param : Erreur longueur (colonne '${param.column}', string longueur max : ${constraint.length})`}
                //         }
                //         break
                //     case 'boolean':
                //         if (!stringAsBoolean(param.value)) {
                //             return {success: false, method: 'checkQueryString', msg: `STRING Param : Erreur type de donnée (colonne '${param.column}', type 'boolean' attendu)`}
                //         }
                //         param.value = ['1', 'true'].includes(param.value.toLowerCase())
                //         break
                // }
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