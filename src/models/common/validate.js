const {stringAsInteger, stringAsBoolean} = require('../../utils/tools')

/*********************************************************
PARAMETRE PASSÉ PAR L'URL : URI PARAM
*********************************************************/

const checkURIParam = (params, tableDef) => {
    const URIParam = params.URIParam
    const tableColumns = tableDef.tableColumns

    if (!URIParam || !URIParam.column || !URIParam.op || !URIParam.value) {
        return {success: false, msg: `La chaîne PathParameter est vide/incomplète`}
    }
    try {
        const constraint = tableColumns[URIParam.column]
        const dataType = constraint.type

        switch (dataType) {
            case 'integer':
                if (!stringAsInteger(URIParam.value)) {
                    return {success: false, method: 'validate.checkURIParam', msg: `Erreur type de donnée (colonne '${URIParam.column}', type 'integer' attendu)`}
                }
                URIParam.value = Number(URIParam.value)
                break
            case 'string':
                if (URIParam.value.length > constraint.length) {
                    return {success: false, method: 'validate.checkURIParam', msg: `Erreur longueur (colonne '${URIParam.column}', longueur max : ${constraint.length})`}
                }
                break
        }

        return {success: true}
    }
    catch(err) {
        throw new Error(`validate.checkURIParam - ${err.name} (${err.message})`)
    }
}

/*********************************************************
PARAMETRES PASSÉS PAR L'URL : QUERY PARAMS
*********************************************************/

const checkQueryParams = (params, tableDef) => {
    const queryParams = params.queryParams

    try {
        if(queryParams) {
            let constraints, value

            for (let param of queryParams) {
                constraints = tableDef.tableColumns[param.column]
                if(!constraints) {
                    return {success: false, method: 'validate.checkQueryParams', msg: `Colonne '${param.column}' absente de la BDD`}
                }
                for (let i = 0; i < param.values.length; i++) {
                    value = param.values[i]

                    switch (constraints.type) {
                        case 'integer':
                            if (!stringAsInteger(value)) {
                                return {success: false, method: 'validate.checkQueryParams', msg: `Erreur type de donnée (colonne '${param.column}', type 'integer' attendu)`}
                            }
                            param.values[i] = Number(value)
                            break
                        case 'string':
                            if (value.length > constraints.length) {
                                return {success: false, method: 'validate.checkQueryParams', msg: `Erreur longueur (colonne '${param.column}', string longueur max : ${constraints.length})`}
                            }
                            break
                        case 'boolean':
                            if (!stringAsBoolean(value)) {
                                return {success: false, method: 'validate.checkQueryParams', msg: `Erreur type de donnée (colonne '${param.column}', type 'boolean' attendu)`}
                            }
                            param.values[i] = (['1', 'true'].includes(value.toLowerCase()) ? 1 : 0)
                            break
                    }
                }
            }
        }

        return {success: true}
    }
    catch(err) {
        throw new Error(`validate.checkQueryParams - ${err.name} (${err.message})`)
    }
}

const checkOrderParam = (params, tableDef) => {
    try {
        const order = params.order
        const tableColumns = tableDef.tableColumns

        if (!tableColumns[order.column]) {
            return {success: false, method: 'validate.checkOrderParam', msg: `Colonne de tri '${order.column}' absente de la BDD`}
        }
        order.direction = (order.direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC')

        return {success: true}
    }
    catch(err) {
        throw new Error(`validate.checkOrderParam - ${err.name} (${err.message})`)
    }
}

/*********************************************************
DONNÉES PASSÉES PAR LE BODY
*********************************************************/

const checkBodyParams = (params, tableDef) => {
    const bodyParams = params.bodyParams

    try {
        let value, constraints, emptyAuthorized

        for (let column in bodyParams) {
            constraints = tableDef.tableColumns[column]
            if(!constraints) {
                return {success: false, method: 'validate.checkBodyParams', msg: `Colonne '${column}' absente de la BDD`}
            }
            value = bodyParams[column]
            if (value === null) {
                if (!constraints.nullAuthorized) return {success: false, method: 'validate.checkBodyParams', msg: `Colonne '${column}', valeur null non autorisée`}
                continue
            }

            switch (constraints.type) {
                case 'integer':
                    if (typeof value !== 'number') {
                        return {success: false, method: 'validate.checkBodyParams', msg: `Erreur type de donnée (colonne '${column}', type 'number' attendu)`}
                    }
                    if (!stringAsInteger(String(value))) {
                        return {success: false, method: 'validate.checkBodyParams', msg: `Erreur type de donnée (colonne '${column}', type 'integer' attendu)`}
                    }
                    break
                case 'string':
                    if (typeof value !== 'string') {
                        return {success: false, method: 'validate.checkBodyParams', msg: `Erreur type de donnée (colonne '${column}', type 'string' attendu)`}
                    }
                    if (value.length > constraints.length) {
                        return {success: false, method: 'validate.checkBodyParams', msg: `Erreur longueur (colonne '${column}', longueur max : ${constraints.length})`}
                    }
                    if(!constraints.emptyAuthorized && value === '') {
                        return {success: false, method: 'validate.checkBodyParams', msg: `Erreur longueur (colonne '${column}', colonne vide non autorisée)`}
                    }
                    break
                case 'boolean':
                    if (![0,1,true,false].includes(value)) {
                        return {success: false, method: 'validate.checkBodyParams', msg: `Erreur type de donnée (colonne '${column}', type 'boolean' attendu)`}
                    }
                    bodyParams[column] = Number(value) // true => 1, false => 0
                    break
                case 'date':
                    if (isNaN(Date.parse(value))) {
                        return {success: false, method: 'validate.checkBodyParams', msg: `Erreur type de donnée (colonne '${column}', type 'date' attendu / date invalide)`}
                    }
                    bodyParams[column] = new Date(value)
                    break
            }
        }

        return {success: true}
    }
    catch(err) {
        throw new Error(`validate.checkBodyParams - ${err.name} (${err.message})`)
    }
}

module.exports = {checkURIParam, checkQueryParams, checkOrderParam, checkBodyParams}