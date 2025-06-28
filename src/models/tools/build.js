/*********************************************************
SELECT
*********************************************************/

const sqlSelectById = (params, tableName) =>  {
    const reqColumns = params.columns || '*'
    const reqTables = params.tables || tableName
    const reqParams = [params.pathParameter.value]
    const sqlWhereClause = ` WHERE ${params.pathParameter.name} ${params.pathParameter.op} ?`

    return {reqString: `SELECT ${reqColumns} FROM ${reqTables}${sqlWhereClause}`, reqParams: reqParams}
}

/*********************************************************
DELETE
*********************************************************/

const sqlDeleteById = (params, tableName) =>  {
    const reqParams = [params.pathParameter.value]
    const sqlWhereClause = ` WHERE ${params.pathParameter.name} ${params.pathParameter.op} ?`

    return {reqString: `DELETE FROM ${tableName}${sqlWhereClause}`, reqParams: reqParams}
}

module.exports = {sqlSelectById, sqlDeleteById}