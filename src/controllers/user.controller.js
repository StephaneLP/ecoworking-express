const user = require('../models/user.model')
const role = require('../models/role.model')
const crud = require('./common/crud')
const {trimStringValues} = require('../utils/tools')
const {op} = require('../config/db.params')

/*********************************************************
READ / GET / SELECT
*********************************************************/

const readUsers = (req, res) => {
    const query = trimStringValues(req.query)

    // TABLES & COLONNES (SELECT...FROM...)
    const tables = {
        mainTable: [user, ['*']],
        joinTables : [[role, ['*']]]
    }

    // FILTRE (clause WHERE)
    const queryParams = []
    
    if(query.id) queryParams.push([user, 'id', op.in, query.id.split(',')])
    if(query.nickname) queryParams.push([user, 'nickname', op.like, [query.nickname], '%?%'])
    if(query.email) queryParams.push([user, 'email', op.like, [query.email], '%?%'])
    if(query.is_verified) queryParams.push([user, 'is_verified', op.equal, [query.is_verified]])

    // TRI (clause ORDER BY)
    const orderParams = [[user, query.sort || 'nickname', query.dir || 'ASC']]

    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readUsers',
    }

    crud.readRecords(params)(req, res)
}

const readUserList = (req, res) => {
    const query = trimStringValues(req.query)

    // TABLES & COLONNES (SELECT...FROM...)
    const tables = {
        mainTable: [user, ['*']],
        joinTables : [[role, ['*']]]
    }

    // FILTRE (clause WHERE)
    const queryParams = []
    
    // TRI (clause ORDER BY)
    const orderParams = [[user, query.sort || 'nickname', query.dir || 'ASC']]

    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readUserList',
    }

    crud.readRecords(params)(req, res)
}

const readUserById = (req, res) => {
    // TABLES & COLONNES (SELECT FROM) / Template : [ modèle, [colonne1, colonne2, ...]]
    const tables = {
        mainTable: [user, ['*']],
        joinTables : [[role, ['*']]]
    }

    // Paramètre transmis par l'URL (URI Param)
    const URIParam = [user, 'id', op.equal, req.params.id.trim()]

    const params = {
        tables: tables,
        URIParam: URIParam,
        functionName: 'readUserById',
    }

    crud.readRecordById(params)(req, res)
}

/*********************************************************
UPDATE / PUT / INSERT INTO
*********************************************************/

const updateUserById = (req, res) => {
    // Paramètre transmis par l'URL (URI Param)
    const URIParam = [user, 'id', op.equal, req.params.id.trim()]

    // Données transmises dans le corps de la requête
    const body = trimStringValues(req.body)

    const params = {
        table: user,
        URIParam: URIParam,
        bodyParams: body,
        functionName: 'updateCityById',
    }

    crud.updateRecordById(params)(req, res)
}

/*********************************************************
DELETE / DELETE / DELETE
*********************************************************/

const deleteUserById = (req, res) => {
    // Paramètre transmis par l'URL (URI Param)
    const URIParam = [user, 'id', op.equal, req.params.id.trim()]

    const params = {
        table: user,
        URIParam: URIParam,
        functionName: 'deleteCityById',
    }

    crud.deleteRecordById(params)(req, res)
}

module.exports = {readUsers, readUserList, readUserById, updateUserById, deleteUserById}