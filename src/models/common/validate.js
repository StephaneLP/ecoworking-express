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
                    return {success: false, method: 'checkURIParam', msg: `(URI Param) Erreur type de donnée (colonne '${URIParam.column}', type 'integer' attendu)`}
                }
                URIParam.value = Number(URIParam.value)
                break
            case 'string':
                if (URIParam.value.length > constraint.length) {
                    return {success: false, method: 'checkURIParam', msg: `(URI Param) Erreur longueur (colonne '${URIParam.column}', longueur max : ${constraint.length})`}
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
PARAMETRES PASSÉS PAR L'URL : QUERY PARAMS
*********************************************************/

const checkValue = (constraints, column, value) => {
    switch (constraints.type) {
        case 'integer':
            if (!stringAsInteger(value)) {
                return `(QUERY Params) Erreur type de donnée (colonne '${column}', type 'integer' attendu)`
            }
            break
        case 'string':
            if (value.length > constraints.length) {
                return `(QUERY Params) Erreur longueur (colonne '${column}', string longueur max : ${constraints.length})`
            }
            break
        case 'boolean':
            if (!stringAsBoolean(value)) {
                return `(QUERY Params) Erreur type de donnée (colonne '${column}', type 'boolean' attendu)`
            }
            break
    }
    return false
}

const checkQueryParams = (params, tableDef) => {
    const queryParams = params.queryParams

    try {
        if(queryParams) {
            let constraints, msg

            for (let param of queryParams) {
                constraints = tableDef.tableColumns[param.column]
                if(!constraints) return {success: false, method: 'checkQueryParams', msg: `(QUERY Params) Colonne '${param.column}' absente de la BDD`}

                if (param.op === 'IN') {
                    console.log('TABLEAU', param.value)
                    for (let value in param.value) {
                        console.log(value, typeof value)
                        param.value[value] = Number(param.value[value])



                        // msg = checkValue(constraints, param.column, value)
                        // if (msg) return {success: false, method: 'checkQueryParams', msg: msg}                        
                    }
console.log('TABLEAU', param.value)


                }
                else {
                    msg = checkValue(constraints, param.column, param.value)
                    if (msg) return {success: false, method: 'checkQueryParams', msg: msg}
                }
            }
        }

        return {success: true}
    }
    catch(err) {
        throw new Error(`checkQueryParams - ${err.name} (${err.message})`)
    }
}

    // // Clause ORDER BY
    // let direction = queryParams.dir || ''
    // direction = direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
    // const sort = {column: queryParams.sort || 'name', direction: direction}

const checkOrderParam = (params, tableDef) => {
    const order = params.order
    const tableColumns = tableDef.tableColumns

}

/*********************************************************
DONNÉES PASSÉES PAR LE BODY
*********************************************************/

const checkBodyParams = (bodyParams, tableColumns) => {
    try {
        let value, constraints, emptyAuthorized

        for (let column in bodyParams) {
            constraints = tableColumns[column]
            if(!constraints) return {success: false, method: 'checkBodyParams', msg: `(BODY Param) Colonne '${column}' absente de la BDD`}
            value = bodyParams[column]
            
            switch (constraints.type) {
                case 'integer':
                    if (!stringAsInteger(value)) {
                        return {success: false, method: 'checkBodyParams', msg: `(BODY Param) Erreur type de donnée (colonne '${column}', type 'integer' attendu)`}
                    }
                    break
                case 'string':
                    if (value.length > constraints.length) {
                        return {success: false, method: 'checkBodyParams', msg: `(BODY Param) Erreur longueur (colonne '${column}', longueur max : ${constraints.length})`}
                    }
                    if(!constraints.emptyAuthorized && value === '') {
                        return {success: false, method: 'checkBodyParams', msg: `(BODY Param) Erreur longueur (colonne '${column}', colonne vide non autorisée)`}
                    }
                    break
                case 'boolean':
                    if (!stringAsBoolean(value)) {
                        return {success: false, method: 'checkBodyParams', msg: `(BODY Param) Erreur type de donnée (colonne '${column}', type 'boolean' attendu)`}
                    }
                    break
            }
        }

        return {success: true}
    }
    catch(err) {
        throw new Error(`checkBodyParams - ${err.name} (${err.message})`)
    }
}

module.exports = {checkURIParam, checkQueryParams, checkOrderParam, checkBodyParams}