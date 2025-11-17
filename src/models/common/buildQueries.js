const {hasChildren} = require('../../config/db.params')
const {op, dbRelations} = require('../../config/db.params')

/*********************************************************
CONSTRUCTION REQUÊTE SELECT
*********************************************************/

const sqlSelect = (params) =>  {
    // SELECT : liste des colonnes
    const reqColumns = buildColumnsList(params).join(', ')

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
    if (params.columns) reqColumns = buildColumnsList(params).join(', ')

    // FROM : tables et jointures
    const reqFROM = buildFromConditions(params)

    // WHERE : liste des conditions et tableau des valeurs
    const URIParam = params.URIParam
    const arrParams = [URIParam[3]]
    const sqlWhereClause = ` WHERE ${params.URIParam[0].tableName}.${URIParam[1]} ${URIParam[2]} ?`

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
    const condition = `${URIParam[1]} ${URIParam[2]} ?`
    arrParams.push(URIParam[3])
    
    return {success: true, reqString: `UPDATE ${model.tableName} SET ${arrColumns.join()} WHERE ${condition}`, reqParams: arrParams}
}

/*********************************************************
CONSTRUCTION REQUÊTE DELETE
*********************************************************/

const sqlDeleteById = (params) =>  {
    const URIParam = params.URIParam
    const arrParams = [URIParam[3]]
    const sqlWhereClause = ` WHERE ${URIParam[1]} ${URIParam[2]} ?`

    return {reqString: `DELETE FROM ${params.table.tableName}${sqlWhereClause}`, reqParams: arrParams}
}

/*********************************************************
CONSTRUCTION LISTE COLONNES REQUÊTE INSERT
*********************************************************/

// SELECT : colonnes
const buildColumnsList = (params) => {
    const mainTable = params.tables.mainTable
    const joinTables = params.tables.joinTables
    const arrColumns = []
    let mainTableName, joinTableName, primaryKey = ''

    // Table principale
    mainTableName = mainTable[0].tableName
    for (let column of mainTable[1]) {
        arrColumns.push(`${mainTableName}.${column}`)
    }

    // Ajout de la clé primaire (sortId) pour la mise en forme JSON si tables enfants jointes    
    if (hasChildren(mainTable[0].tableName, joinTables)) {
        const tableColumns = mainTable[0].tableColumns
        for (let column in tableColumns) {
            if (tableColumns[column].primaryKey) {
                primaryKey = column
                continue
            }
        }
        arrColumns.push(`${mainTableName}.${primaryKey} AS parentID`)
    }

    // Tables jointes (facultatives)
    for (let table of joinTables) {
        joinTableName = table[0].tableName
        for (let column of table[1]) {
            arrColumns.push(`${joinTableName}.${column}`)
        }        
    }

    return arrColumns
}

/*********************************************************
CONSTRUCTION CLAUSES
*********************************************************/

// clause FROM
const buildFromConditions = (params) => {
    const mainTable = params.tables.mainTable
    const joinTables = params.tables.joinTables
    const mainTableName = mainTable[0].tableName
    let tableList, condition, joinTableName

    tableList = mainTableName
    for (let joinTable of joinTables) {
        joinTableName = joinTable[0].tableName
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
        switch (param[2]) { // Opérateur
            case op.like:
                value = param[3][0] // Tableau des valeurs (1 élément)
                value = value.replace('%', '\\%')       
                value = value.replace('_', '\\_')
                value = param[4].replace('?', value)
                arrParams.push(value)
                pattern = '?'
                break
            case op.in:
                param[3].forEach(e => {
                    arrPattern.push('?')
                    arrParams.push(e)
                })
                pattern = `(${arrPattern.join()})`
                break
            default:
                value = param[3][0]
                arrParams.push(value)
                pattern = '?'
        }
    
        arrConditions.push(`${param[0].tableName}.${param[1]} ${param[2]} ${pattern}`)
    }

    return {conditions: arrConditions, params: arrParams}
}

// Clause ORDER
const buildSortConditions = (params) => {
    const arrOrder = []
    for (let condition of params.orderParams) {
        arrOrder.push(`${condition[0].tableName}.${condition[1]} ${condition[2]}`)
    }

    return arrOrder
}

module.exports = {sqlSelect, sqlSelectById, sqlDeleteById, sqlInsert, sqlUpdateById}