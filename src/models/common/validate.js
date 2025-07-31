const {stringAsInteger, stringAsBoolean} = require('../../utils/tools')

/*********************************************************
VÉRIFICATION DES DONNÉES : REQUÊTES SELECT
(1 OU PLUSIEURS TABLES DANS LA CLAUSE SQL FROM)
*********************************************************/

const checkQueryParams = (params) => {
    const queryParams = params.queryParams

    try {
        if(queryParams) {
            let constraints, value

            for (let param of queryParams) {
                constraints = param.model.tableColumns[param.column]
                if(!constraints) {
                    return {success: false, functionName: 'validate.checkQueryParams', msg: `Colonne '${param.column}' absente de la BDD`}
                }
                console.log(param.values)
                for (let i in param.values) {
                    value = param.values[i]

                    switch (constraints.type) {
                        case 'integer':
                            if (!stringAsInteger(value)) {
                                return {success: false, functionName: 'validate.checkQueryParams', msg: `Erreur type de donnée (colonne '${param.column}', type 'integer' attendu)`}
                            }
                            param.values[i] = Number(value)
                            break
                        case 'string':
                            if (value.length > constraints.length) {
                                return {success: false, functionName: 'validate.checkQueryParams', msg: `Erreur longueur (colonne '${param.column}', string longueur max : ${constraints.length})`}
                            }
                            break
                        case 'boolean':
                            if (!stringAsBoolean(value)) {
                                return {success: false, functionName: 'validate.checkQueryParams', msg: `Erreur type de donnée (colonne '${param.column}', type 'boolean' attendu)`}
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

const checkOrderParams = (params) => {
    try {
        let model

        for (let sort of params.orderParams) {
            model = sort.model
            if (!model.tableColumns[sort.column]) {
                return {success: false, functionName: 'validate.checkOrderParams', msg: `Colonne de tri '${sort.column}' absente de la BDD`}
            }
            sort.direction = (sort.direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC')            
        }

        return {success: true}
    }
    catch(err) {
        throw new Error(`validate.checkOrderParams - ${err.name} (${err.message})`)
    }
}

/*********************************************************
VÉRIFICATION DES DONNÉES : REQUÊTES CREATE, UPDATE & DELETE
(1 TABLE DANS LA CLAUSE SQL FROM)
*********************************************************/

// Paramètre reçu via l'url (URI PARAM)
const checkURIParam = (params) => {
    const URIParam = params.URIParam

    if (!URIParam.value) {
        return {success: false, msg: 'La chaîneURIParameter est vide'}
    }
    try {
        const constraint = URIParam.model.tableColumns[URIParam.column]
        const dataType = constraint.type

        switch (dataType) {
            case 'integer':
                if (!stringAsInteger(URIParam.value)) {
                    return {success: false, functionName: 'validate.checkURIParam', msg: `Erreur type de donnée (colonne '${URIParam.column}', type 'integer' attendu)`}
                }
                URIParam.value = Number(URIParam.value)
                break
            case 'string':
                if (URIParam.value.length > constraint.length) {
                    return {success: false, functionName: 'validate.checkURIParam', msg: `Erreur longueur (colonne '${URIParam.column}', longueur max : ${constraint.length})`}
                }
                break
        }

        return {success: true}
    }
    catch(err) {
        throw new Error(`validate.checkURIParam - ${err.name} (${err.message})`)
    }
}

// Paramètres reçus via le corps de la requête HTTP (BODY PARAMS)
const checkBodyParams = (params) => {
    const bodyParams = params.bodyParams
    const model = params.table

    try {
        let value, constraints

        for (let column in bodyParams) {
            constraints = model.tableColumns[column]
            if(!constraints) {
                return {success: false, functionName: 'validate.checkBodyParams', msg: `Colonne '${column}' absente de la BDD`}
            }
            value = bodyParams[column]
            if (value === null) {
                if (!constraints.nullAuthorized) return {success: false, functionName: 'validate.checkBodyParams', msg: `Colonne '${column}', valeur null non autorisée`}
                continue
            }
            switch (constraints.type) {
                case 'integer':
                    if (typeof value !== 'number') {
                        return {success: false, functionName: 'validate.checkBodyParams', msg: `Erreur type de donnée (colonne '${column}', type 'number' attendu)`}
                    }
                    if (!stringAsInteger(String(value))) {
                        return {success: false, functionName: 'validate.checkBodyParams', msg: `Erreur type de donnée (colonne '${column}', type 'integer' attendu)`}
                    }
                    break
                case 'string':
                    if (typeof value !== 'string') {
                        return {success: false, functionName: 'validate.checkBodyParams', msg: `Erreur type de donnée (colonne '${column}', type 'string' attendu)`}
                    }
                    if (value.length > constraints.length) {
                        return {success: false, functionName: 'validate.checkBodyParams', msg: `Erreur longueur (colonne '${column}', longueur max : ${constraints.length})`}
                    }
                    if(!constraints.emptyAuthorized && value === '') {
                        return {success: false, functionName: 'validate.checkBodyParams', msg: `Erreur longueur (colonne '${column}', colonne vide non autorisée)`}
                    }
                    break
                case 'boolean':
                    if (![0,1,true,false].includes(value)) {
                        return {success: false, functionName: 'validate.checkBodyParams', msg: `Erreur type de donnée (colonne '${column}', type 'boolean' attendu)`}
                    }
                    bodyParams[column] = Number(value) // true => 1, false => 0
                    break
                case 'date':
                    if (isNaN(Date.parse(value))) {
                        return {success: false, functionName: 'validate.checkBodyParams', msg: `Erreur type de donnée (colonne '${column}', type 'date' attendu / date invalide)`}
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

module.exports = {checkURIParam, checkQueryParams, checkOrderParams, checkBodyParams}