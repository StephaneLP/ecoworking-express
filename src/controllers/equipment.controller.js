const equipment = require('../models/equipment.model')
const ecoworking = require('../models/ecoworking.model')
const icon = require('../models/icon.model')
const crud = require('./common/crud')
const {trimStringValues} = require('../utils/tools')
const {op} = require('../config/db.params')

/*********************************************************
READ / GET / SELECT
*********************************************************/

const readEquipments = (req, res) => {
    const query = trimStringValues(req.query)

    // TABLES & COLONNES (SELECT FROM) / Template : [ modèle, [colonne1, colonne2, ...]]
    const tables = {
        mainTable: [equipment, ['*']],
        joinTables : [[icon, ['*']], [ecoworking, ['*']]]
    }

    // FILTRE (WHERE) / Template : [ modèle, colonne, opérateur, [valeurs] (,option : paterne)]
    const queryParams = []
    if(query.id) queryParams.push([equipment, 'id', op.in, query.id.split(',')])
    if(query.name) queryParams.push([equipment, 'name', op.like, [query.name], '%?%'])
    if(query.iconid) queryParams.push([equipment, 'icon_id', op.in, [query.iconid]])
    if(query.ecoworkingid) queryParams.push([equipment, 'ecoworking_id', op.in, [query.ecoworkingid]])

    // TRI (ORDER BY) / Template [modèle, colonne, direction]
    const orderParams = [[equipment, 'ecoworking_id', 'ASC'], [equipment, 'rank', 'ASC']]

    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readEquipments',
    }

    crud.readRecords(params)(req, res)
}

const readEquipmentList = (req, res) => {
    // TABLES & COLONNES (SELECT FROM) / Template : [ modèle, [colonne1, colonne2, ...]]
    const tables = {
        mainTable: [equipment, ['*']],
        joinTables : []
    }

    // FILTRE (WHERE) / Template : [ modèle, colonne, opérateur, [valeurs] (,option : paterne)]
    const queryParams = []
    
    // TRI (ORDER BY) / Template [modèle, colonne, direction]
    const orderParams = [[equipment, 'ecoworking_id', 'ASC'], [equipment, 'rank', 'ASC']]

    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readEquipmentList',
    }

    crud.readRecords(params)(req, res)
}

const readEquipmentById = (req, res) => {
    // TABLES & COLONNES (SELECT FROM) / Template : [ modèle, [colonne1, colonne2, ...]]
    const tables = {
        mainTable: [equipment, ['name']],
        joinTables : []
    }

    // Paramètre transmis par l'URL (URI Param)
    const URIParam = [equipment, 'id', op.equal, req.params.id.trim()]

    const params = {
        tables: tables,
        URIParam: URIParam,
        functionName: 'readEquipmentById',
    }

    crud.readRecordById(params)(req, res)
}

/*********************************************************
CREATE / POST / INSERT INTO
*********************************************************/

const createEquipment = (req, res) => {
    // Données transmises dans le corps de la requête
    const body = trimStringValues(req.body)

    const params = {
        table: equipment,
        bodyParams: body,
        functionName: 'createEquipment',
    }

    crud.createRecord(params)(req, res)
}

/*********************************************************
UPDATE / PUT / INSERT INTO
*********************************************************/

const updateEquipmentById = (req, res) => {
    // Paramètre transmis par l'URL (URI Param)
    const URIParam = [equipment, 'id', op.equal, req.params.id.trim()]

    // Données transmises dans le corps de la requête
    const body = trimStringValues(req.body)

    const params = {
        table: equipment,
        URIParam: URIParam,
        bodyParams: body,
        functionName: 'updateEquipmentById',
    }

    crud.updateRecordById(params)(req, res)
}

/*********************************************************
DELETE / DELETE / DELETE
*********************************************************/

const deleteEquipmentById = (req, res) => {
    // Paramètre transmis par l'URL (URI Param)
    const URIParam = [equipment, 'id', op.equal, req.params.id.trim()]

    const params = {
        table: equipment,
        URIParam: URIParam,
        functionName: 'deleteEquipmentById',
    }

    crud.deleteRecordById(params)(req, res)
}

module.exports = {readEquipments, readEquipmentList, readEquipmentById, deleteEquipmentById, createEquipment, updateEquipmentById}