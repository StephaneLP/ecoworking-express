const {op, dbRelations} = require('../../config/db.params')

/*********************************************************
CONSTRUCTION REQUÊTE SELECT
*********************************************************/

const sqlSelect = (params) =>  {
    // SELECT : liste des colonnes
    let reqColumns = [...buildColumnsList(params)].join(', ')

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
    const sqlWhereClause = ` WHERE ${params.URIParam.model.tableName}.${URIParam.column} ${URIParam.op} ?`

    return {reqString: `SELECT ${reqColumns} FROM ${reqFROM}${sqlWhereClause}`, reqParams: arrParams}
}

/*********************************************************
CONSTRUCTION REQUÊTE INSERT INTO
*********************************************************/

const sqlInsert = (params) => {
    const model = params.table
    const arrColumns = [], arrParams = [], arrPattern = []
    let constraints, value

    for(let column in model.tableColumns) {
        constraints = model.tableColumns[column]
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
    const dateColumn = model.dateColumns.createDate
    if (dateColumn) {
        arrColumns.push(dateColumn)
        arrParams.push(new Date())
        arrPattern.push('?')
    }

    return {success: true, reqString: `INSERT INTO ${model.tableName} (${arrColumns.join()}) VALUES (${arrPattern.join()})`, reqParams: arrParams}
}

/*********************************************************
CONSTRUCTION REQUÊTE UPDATE
*********************************************************/

const sqlUpdateById = (params) => {
    const arrColumns = [], arrParams = []
    const URIParam = params.URIParam
    const model = params.table

    // Colonnes mises à jour
    for(let column in params.bodyParams) {
        arrColumns.push(`${column}=?`)
        arrParams.push(params.bodyParams[column])
    }

    // Date de modification
    const dateColumn = model.dateColumns.updateDate
    if (dateColumn) {
        arrColumns.push(`${dateColumn}=?`)
        arrParams.push(new Date())
    }

    // Clause WHERE
    const condition = `${URIParam.column} ${URIParam.op} ?`
    arrParams.push(URIParam.value)
    
    return {success: true, reqString: `UPDATE ${model.tableName} SET ${arrColumns.join()} WHERE ${condition}`, reqParams: arrParams}
}

/*********************************************************
CONSTRUCTION REQUÊTE DELETE
*********************************************************/

const sqlDeleteById = (params) =>  {
    const URIParam = params.URIParam
    const arrParams = [URIParam.value]
    const sqlWhereClause = ` WHERE ${URIParam.column} ${URIParam.op} ?`

    return {reqString: `DELETE FROM ${params.table.tableName}${sqlWhereClause}`, reqParams: arrParams}
}

/*********************************************************
CONSTRUCTION CLAUSES ET LISTES COLONNES REQUÊTE INSERT
*********************************************************/

// SELECT : colonnes
const buildColumnsList = (params) => {
    const mainTable = params.tables.mainTable
    const joinTables = params.tables.joinTables
    const arrColumns = []
    let mainTableName, joinTableName, primaryKey = ''

    // Table principale
    mainTableName = mainTable.model.tableName
    for (let column of mainTable.columns) {
        arrColumns.push(`${mainTableName}.${column}`)
    }

    // Ajout de la clé primaire (sortId) pour la mise en forme JSON si tables enfants jointes
    if (mainTable.hasChildren) {
        const tableColumns = mainTable.model.tableColumns
        for (let column in tableColumns) {
            if (tableColumns[column].primaryKey) {
                primaryKey = column
                continue
            }
        }
        arrColumns.push(`${mainTableName}.${primaryKey} AS sortID`)
    }

    // Tables jointes (facultatives)
    for (let table of joinTables) {
        joinTableName = table.model.tableName
        for (let column of table.columns) {
            arrColumns.push(`${joinTableName}.${column}`)
        }        
    }

    return arrColumns
}

// clause FROM
const buildFromConditions = (params) => {
    const mainTable = params.tables.mainTable
    const joinTables = params.tables.joinTables
    const mainTableName = mainTable.model.tableName
    let tableList, condition, joinTableName

    tableList = mainTableName
    for (let joinTable of joinTables) {
        joinTableName = joinTable.model.tableName
        condition = dbRelations[mainTableName][joinTableName][1]
        tableList += ` INNER JOIN ${joinTableName} ON ${condition}`
    }

    return tableList
}

// Clause WHERE
const buildWhereConditions = (params)  => {
    const arrParams = [], arrPattern = [], arrConditions = []
    let value, pattern

    for (let param of params.queryParams) {
        switch (param.op) {
            case op.like:
                value = param.values[0]
                value = value.replace('%', '\\%')       
                value = value.replace('_', '\\_')
                value = param.pattern.replace('?', value)
                arrParams.push(value)
                pattern = '?'
                break
            case op.in:
                param.values.forEach(e => {
                    arrPattern.push('?')
                    arrParams.push(e)
                })
                pattern = `(${arrPattern.join()})`
                break
            default:
                value = param.values[0]
                arrParams.push(value)
                pattern = '?'
        }
    
        arrConditions.push(`${param.model.tableName}.${param.column} ${param.op} ${pattern}`)
    }

    return {conditions: arrConditions, params: arrParams}
}

// Clause ORDER
const buildSortConditions = (params) => {
    const arrOrder = []
    for (let sort of params.orderParams) {
        arrOrder.push(`${sort.model.tableName}.${sort.column} ${sort.direction}`)
    }

    return arrOrder
}

module.exports = {sqlSelect, sqlSelectById, sqlDeleteById, sqlInsert, sqlUpdateById}