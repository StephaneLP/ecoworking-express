const iconType = require("../models/iconType.model")

const op = {
    equal: '=',
    like: 'LIKE',
    in: 'IN'
}

const relationType = {
    onetoOne: 'hasOne',
    oneToMany: 'oneToMany',
    belongsTo: 'belongsTo'
}

const dbRelations = {
    role: {
        user: [relationType.oneToMany, 'role.id = user.role_id']
    },
    user: {
        role: [relationType.belongsTo, 'user.role_id = role.id'],
        icon: [relationType.belongsTo, 'user.icon_id = icon.id'],
        evaluation: [relationType.oneToMany, 'user.id = evaluation.user_id']
    },
    icon_type: {
        icon: [relationType.oneToMany, 'icon_type.id = icon.icon_type_id']
    },
    icon: {
        icon_type: [relationType.belongsTo, 'icon.icon_type_id = icon_type.id'],
        user: [relationType.oneToMany, 'icon.id = user.icon_id'],
        equipement: [relationType.oneToMany, 'icon.id = equipement.icon_id'],
    },
    city: { 
        ecoworking: [relationType.oneToMany, 'city.id = ecoworking.city_id']
    },
    ecoworking: {
        city: [relationType.belongsTo, 'ecoworking.city_id = city.id'],
        information: [relationType.oneToMany, 'ecoworking.id = information.ecoworking_id'],
        equipement: [relationType.oneToMany, 'ecoworking.id = equipement.ecoworking_id'],
        evaluation: [relationType.oneToMany, 'ecoworking.id = evaluation.ecoworking_id']
    },
    equipment: {
        icon: [relationType.belongsTo, 'equipment.icon_id = icon.id'],
        ecoworking: [relationType.belongsTo, 'equipment.ecoworking_id = ecoworking.id']
    },
    evaluation: {
        user: [relationType.belongsTo, 'evaluation.user_id = user.id'],
        ecoworking: [relationType.belongsTo, 'evaluation.ecoworking_id = ecoworking.id']
    }
}

// La table 'mainTableName' est-elle parente de la table 'table' (relation one to many) ?
const isParent = (mainTableName, table) => {
    return dbRelations[mainTableName][table][0] === relationType.oneToMany
}

// La table 'mainTableName' est-elle parente d'au moins une table du tableau joinTables (relation one to many) ?
const hasChildren = (mainTableName, joinTables) => {
    for (let table of joinTables) {
        if (isParent(mainTableName, table[0].tableName)) return true
    }
    return false
}

module.exports = {op, dbRelations, isParent, hasChildren}