const {isInteger, isBoolean} = require('../../utils/tools')

const checkPathParameter = (pathParam, columns) => {

    if (!pathParam || !pathParam.column || !pathParam.op || !pathParam.value) {
        return {success: false, msg: `La chaîne PathParameter est vide/incomplète`}
    }
    try {
        const constraint = columns[pathParam.column]
        const dataType = constraint.type

        switch (dataType) {
            case 'integer':
                if (!isInteger(pathParam.value)) {
                    return {success: false, method: 'checkPathParameter', msg: `Erreur type de donnée pathParameter (colonne '${pathParam.column}', type 'integer' attendu)`}
                }
                pathParam.value = Number(pathParam.value)
                break
            case 'string':
                if (pathParam.value.length > constraint.length) {
                    return {success: false, method: 'checkPathParameter', msg: `Erreur longueur du pathParameter (colonne '${pathParam.column}', string longueur max : ${constraint.length})`}
                }
                break
        }

        if ((dataType === 'string' && pathParam.value.lenght == 0 )|| pathParam.value == null) {
            return {success: false, method: 'checkPathParameter', msg: `Erreur valeur du pathParameter (colonne '${pathParam.column}', 'null', 'undefined' et chaine vide non authorisés)`}
        }

        return {success: true}
    }
    catch(err) {
        throw new Error(`checkPathParameter - ${err.name} (${err.message})`)
    }
}

const checkQueryString = (queryStringParams, columns) => {
    try {
        if(queryStringParams) {
            let constraint, dataType

            for (let param of queryStringParams) {
                constraint = columns[param.column]
                dataType = constraint.type

                switch (dataType) {
                    case 'integer':
                        if (!isInteger(param.value)) {
                            return {success: false, method: 'checkQueryString', msg: `Erreur type de donnée (queryString)paramètre (colonne '${param.column}', type 'integer' attendu)`}
                        }
                        param.value = Number(param.value)
                        break
                    case 'string':
                        if (param.value.length > constraint.length) {
                            return {success: false, method: 'checkQueryString', msg: `Erreur longueur du (queryString)paramètre (colonne '${param.column}', string longueur max : ${constraint.length})`}
                        }
                        break
                    case 'boolean':
                        if (!isBoolean(param.value)) {
                            return {success: false, method: 'checkQueryString', msg: `Erreur type de donnée (queryString)paramètre (colonne '${param.column}', type 'boolean' attendu)`}
                        }
                        if (typeof param.value === 'string') param.value = ['1', 'true'].includes(param.value.toLowerCase())
                        break
                }

                if ((dataType === 'string' && param.value.lenght == 0 )|| param.value == null) {
                    return {success: false, method: 'checkQueryString', msg: `Erreur valeur du (queryString)paramètre (colonne '${param.column}', 'null', 'undefined' et chaine vide non authorisés)`}
                }
            }
        }

        return {success: true}
    }
    catch(err) {
        throw new Error(`checkQueryString - ${err.name} (${err.message})`)
    }
}

module.exports = {checkPathParameter, checkQueryString}