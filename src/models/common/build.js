const {buildColumnsList, buildFromConditions, buildWhereConditions, buildSortConditions} = require('./tools')

/*********************************************************
SELECT
*********************************************************/

const sqlSelect = (params) =>  {
    // SELECT : liste des colonnes
    let reqColumns = '*'
    if (params.columns) reqColumns = [...buildColumnsList(params)].join(', ')

    // FROM : tables et jointures
    const reqFROM = buildFromConditions(params)

    // WHERE : liste des conditions et tableau des valeurs
    const conditions = buildWhereConditions(params)
    const arrParams = [...conditions.params]
    const reqConditions = [...conditions.conditions].join(' AND ')
    const reqWhere = reqConditions ? ` WHERE ${reqConditions}` : ''

    // ORDER : tri
    const reqOrder = ` ORDER BY ${[...buildSortConditions(params)].join(', ')}`

    return {reqString: `SELECT ${reqColumns} FROM ${reqFROM}${reqWhere}${reqOrder}`, reqParams: arrParams}
}

const sqlSelectById = (params) =>  {
    // SELECT : liste des colonnes
    let reqColumns = '*'
    if (params.columns) reqColumns = [...buildColumnsList(params)].join(', ')

    // FROM : tables et jointures
    const reqFROM = buildFromConditions(params)

    // WHERE : liste des conditions et tableau des valeurs
    const URIParam = params.URIParam
    const arrParams = [URIParam.value]
    const sqlWhereClause = ` WHERE ${params.URIParam.tableDef.tableName}.${URIParam.column} ${URIParam.op} ?`

    return {reqString: `SELECT ${reqColumns} FROM ${reqFROM}${sqlWhereClause}`, reqParams: arrParams}
}

/*********************************************************
INSERT INTO
*********************************************************/

const sqlInsert = (params) => {
    const tableDef = params.tableDef
    const arrColumns = [], arrParams = [], arrPattern = []
    let constraints, value

    for(let column in tableDef.tableColumns) {
        constraints = tableDef.tableColumns[column]
        value = params.bodyParams[column] === undefined ? null : params.bodyParams[column]

        if (constraints.autoIncrement) continue
        if (!constraints.nullAuthorized && value === null) {
            return {success: false, functionName: 'build.sqlInsert', msg: `Colonne '${column}' : Null non autorisé`}
        }

        arrColumns.push(column)
        arrParams.push(value)
        arrPattern.push('?')
    }

    // Date de création
    const dateColumn = tableDef.dateColumns.createDate
    if (dateColumn) {
        arrColumns.push(dateColumn)
        arrParams.push(new Date())
        arrPattern.push('?')
    }

    return {success: true, reqString: `INSERT INTO ${tableDef.tableName} (${arrColumns.join()}) VALUES (${arrPattern.join()})`, reqParams: arrParams}
}

/*********************************************************
UPDATE
*********************************************************/

const sqlUpdateById = (params) => {
    const arrColumns = [], arrParams = []
    const URIParam = params.URIParam
    const tableDef = params.tableDef

    // Colonnes mises à jour
    for(let column in params.bodyParams) {
        arrColumns.push(`${column}=?`)
        arrParams.push(params.bodyParams[column])
    }

    // Date de modification
    const dateColumn = tableDef.dateColumns.updateDate
    if (dateColumn) {
        arrColumns.push(`${dateColumn}=?`)
        arrParams.push(new Date())
    }

    // Clause WHERE
    const condition = `${URIParam.column} ${URIParam.op} ?`
    arrParams.push(URIParam.value)
    
    return {success: true, reqString: `UPDATE ${tableDef.tableName} SET ${arrColumns.join()} WHERE ${condition}`, reqParams: arrParams}
}

/*********************************************************
DELETE
*********************************************************/

const sqlDeleteById = (params) =>  {
    const URIParam = params.URIParam
    const arrParams = [URIParam.value]
    const sqlWhereClause = ` WHERE ${URIParam.column} ${URIParam.op} ?`

    return {reqString: `DELETE FROM ${params.tableDef.tableName}${sqlWhereClause}`, reqParams: arrParams}
}

module.exports = {sqlSelect, sqlSelectById, sqlDeleteById, sqlInsert, sqlUpdateById}