const iconType = require('../models/iconType.model')
const icon = require('../models/icon.model')
const crud = require('./common/crud')
const {trimStringValues} = require('../utils/tools')
const {op} = require('../config/db.params')

/*********************************************************
READ / GET / SELECT
*********************************************************/

const readIconTypes = (req, res) => {
    const query = trimStringValues(req.query)

    // TABLES & COLONNES (SELECT FROM) / Template : [ modèle, [colonne1, colonne2, ...]]
    const tables = {
        mainTable: [iconType, ['*']],
        joinTables : [[icon, ['*']]]
    }

    // FILTRE (WHERE) / Template : [ modèle, colonne, opérateur, [valeurs] (,option : paterne)]
    const queryParams = []
    if(query.id) queryParams.push([iconType, 'id', op.in, query.id.split(',')])
    if(query.name) queryParams.push([iconType, 'name', op.like, [query.name], '%?%'])

    // TRI (ORDER BY) / Template [modèle, colonne, direction]
    const orderParams = [[iconType, 'name', 'ASC']]

    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readIconTypes',
    }

    crud.readRecords(params)(req, res)
}

const readIconTypeList = (req, res) => {
    // TABLES & COLONNES (SELECT FROM) / Template : [ modèle, [colonne1, colonne2, ...]]
    const tables = {
        mainTable: [iconType, ['*']],
        joinTables : []
    }

    // FILTRE (WHERE) / Template : [ modèle, colonne, opérateur, [valeurs] (,option : paterne)]
    const queryParams = []
    
    // TRI (ORDER BY) / Template [modèle, colonne, direction]
    const orderParams = [[iconType, 'name', 'ASC']]

    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readIconTypeList',
    }

    crud.readRecords(params)(req, res)
}

const readIconTypeById = (req, res) => {
    // TABLES & COLONNES (SELECT FROM) / Template : [ modèle, [colonne1, colonne2, ...]]
    const tables = {
        mainTable: [iconType, ['name']],
        joinTables : []
    }

    // Paramètre transmis par l'URL (URI Param)
    const URIParam = [iconType, 'id', op.equal, req.params.id.trim()]

    const params = {
        tables: tables,
        URIParam: URIParam,
        functionName: 'readIconTypeById',
    }

    crud.readRecordById(params)(req, res)
}

/*********************************************************
CREATE / POST / INSERT INTO
*********************************************************/

const createIconType = (req, res) => {
    // Données transmises dans le corps de la requête
    const body = trimStringValues(req.body)

    const params = {
        table: iconType,
        bodyParams: body,
        functionName: 'createIconType',
    }

    crud.createRecord(params)(req, res)
}

/*********************************************************
UPDATE / PUT / INSERT INTO
*********************************************************/

const updateIconTypeById = (req, res) => {
    // Paramètre transmis par l'URL (URI Param)
    const URIParam = [iconType, 'id', op.equal, req.params.id.trim()]

    // Données transmises dans le corps de la requête
    const body = trimStringValues(req.body)

    const params = {
        table: iconType,
        URIParam: URIParam,
        bodyParams: body,
        functionName: 'updateIconTypeById',
    }

    crud.updateRecordById(params)(req, res)
}

/*********************************************************
DELETE / DELETE / DELETE
*********************************************************/

const deleteIconTypeById = (req, res) => {
    // Paramètre transmis par l'URL (URI Param)
    const URIParam = [iconType, 'id', op.equal, req.params.id.trim()]

    const params = {
        table: iconType,
        URIParam: URIParam,
        functionName: 'deleteIconTypeById',
    }

    crud.deleteRecordById(params)(req, res)
}

module.exports = {readIconTypes, readIconTypeList, readIconTypeById, deleteIconTypeById, createIconType, updateIconTypeById}



