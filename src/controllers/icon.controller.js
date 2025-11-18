const icon = require('../models/icon.model')
const iconType = require('../models/iconType.model')
const crud = require('./common/crud')
const {trimStringValues} = require('../utils/tools')
const {op} = require('../config/db.params')

/*********************************************************
READ / GET / SELECT
*********************************************************/

const readIcons = (req, res) => {
    const query = trimStringValues(req.query)

    // TABLES & COLONNES (SELECT FROM) / Template : [ modèle, [colonne1, colonne2, ...]]
    const tables = {
        mainTable: [icon, ['*']],
        joinTables : [[iconType, ['*']]]
    }

    // FILTRE (WHERE) / Template : [ modèle, colonne, opérateur, [valeurs] (,option : paterne)]
    const queryParams = []
    if(query.id) queryParams.push([icon, 'id', op.in, query.id.split(',')])
    if(query.name) queryParams.push([icon, 'name', op.like, [query.name], '%?%'])
    if(query.icon_type_id) queryParams.push([icon, 'icon_type_id', op.equal, [query.icon_type_id]])

    // TRI (ORDER BY) / Template [modèle, colonne, direction]
    const orderParams = [[icon, 'icon_type_id', 'ASC'], [icon, 'name', 'ASC']]

    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readIcons',
    }

    crud.readRecords(params)(req, res)
}

const readIconList = (req, res) => {
    // TABLES & COLONNES (SELECT FROM) / Template : [ modèle, [colonne1, colonne2, ...]]
    const tables = {
        mainTable: [icon, ['name']],
        joinTables : []
    }

    // FILTRE (WHERE) / Template : [ modèle, colonne, opérateur, [valeurs] (,option : paterne)]
    const queryParams = []
    
    // TRI (ORDER BY) / Template [modèle, colonne, direction]
    const orderParams = [[icon, 'icon_type_id', 'ASC'], [icon, 'name', 'ASC']]

    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readIconList',
    }

    crud.readRecords(params)(req, res)
}

const readIconById = (req, res) => {
    // TABLES & COLONNES (SELECT FROM) / Template : [ modèle, [colonne1, colonne2, ...]]
    const tables = {
        mainTable: [icon, ['name']],
        joinTables : []
    }

    // Paramètre transmis par l'URL (URI Param)
    const URIParam = [icon, 'id', op.equal, req.params.id.trim()]

    const params = {
        tables: tables,
        URIParam: URIParam,
        functionName: 'readIconById',
    }

    crud.readRecordById(params)(req, res)
}

/*********************************************************
CREATE / POST / INSERT INTO
*********************************************************/

const createIcon = (req, res) => {
    // Données transmises dans le corps de la requête
    const body = trimStringValues(req.body)

    const params = {
        table: icon,
        bodyParams: body,
        functionName: 'createIcon',
    }

    crud.createRecord(params)(req, res)
}

/*********************************************************
UPDATE / PUT / INSERT INTO
*********************************************************/

const updateIconById = (req, res) => {
    // Paramètre transmis par l'URL (URI Param)
    const URIParam = [icon, 'id', op.equal, req.params.id.trim()]

    // Données transmises dans le corps de la requête
    const body = trimStringValues(req.body)

    const params = {
        table: icon,
        URIParam: URIParam,
        bodyParams: body,
        functionName: 'updateIconById',
    }

    crud.updateRecordById(params)(req, res)
}

/*********************************************************
DELETE / DELETE / DELETE
*********************************************************/

const deleteIconById = (req, res) => {
    // Paramètre transmis par l'URL (URI Param)
    const URIParam = [icon, 'id', op.equal, req.params.id.trim()]

    const params = {
        table: icon,
        URIParam: URIParam,
        functionName: 'deleteIconById',
    }

    crud.deleteRecordById(params)(req, res)
}

module.exports = {readIcons, readIconList, readIconById, deleteIconById, createIcon, updateIconById}