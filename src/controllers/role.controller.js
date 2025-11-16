const role = require('../models/role.model')
const user = require('../models/user.model')
const crud = require('./common/crud')
const {trimStringValues} = require('../utils/tools')
const {op} = require('../config/db.params')

/*********************************************************
READ / GET / SELECT
*********************************************************/

const readRoles = (req, res) => {
    const query = trimStringValues(req.query)

    // TABLES & COLONNES (SELECT...FROM...)
    const tables = {
        mainTable: [role, ['*']],
        joinTables: [[user, ['*']]]
    }

    // FILTRE (clause WHERE)
    const queryParams = []

    if(query.name) queryParams.push([role, 'name', op.like, [query.name], '%?%'])
    if(query.code) queryParams.push([role, 'code', op.like, query.code.split(',')])

    // TRI (clause ORDER BY)
    const orderParams = [[role, query.sort || 'rank', query.dir || 'ASC']]
    
    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readRoles',
    }

    crud.readRecords(params)(req, res)
}

const readRoleList = (req, res) => {
    const query = trimStringValues(req.query)

    // TABLES & COLONNES (SELECT...FROM...)
    const tables = {
        mainTable: [role, ['*']],
        joinTables: []
    }

    // FILTRE (clause WHERE)
    const queryParams = []

    // TRI (clause ORDER BY)
    const orderParams = [[role, query.sort || 'name', query.dir || 'ASC']]

    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readAllRoles',
    }

    crud.readRecords(params)(req, res)
}

module.exports = {readRoles, readRoleList}