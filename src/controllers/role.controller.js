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
        mainTable: {
            model: role,
            columns: ['*']
        },
        joinTables: [{
            model: user,
            columns: ['*']
        }]
    }

    // FILTRE (clause WHERE)
    const queryParams = []

    if(query.name) queryParams.push({
        model: role, 
        column: 'name', 
        op: op.like, 
        values: [query.name], pattern: '%?%'})

    if(query.code) queryParams.push({
        model: role, 
        column: 'code', 
        op: op.like, 
        values: query.code.split(',')})

    // TRI (clause ORDER BY)
    const orderParams = [
        {model: role, column: query.sort || 'rank', direction: query.dir || 'ASC'}
    ]
    
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
        mainTable: {
            model: role,
            columns: ['name', 'code']
        },
        joinTables: []
    }

    // FILTRE (clause WHERE)
    const queryParams = []

    // TRI (clause ORDER BY)
    const orderParams = [
        {model: role, column: query.sort || 'name', direction: query.dir || 'ASC'}
    ]

    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readAllRoles',
    }

    crud.readRecords(params)(req, res)
}

module.exports = {readRoles, readRoleList}