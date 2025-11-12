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
    city: { 
        ecoworking: [relationType.oneToMany, 'city.id = ecoworking.city_id']
    },
    ecoworking: {
        city: [relationType.belongsTo, 'ecoworking.city_id = city.id'],
        information: [relationType.oneToMany, 'ecoworking.id = information.ecoworking_id'],
        equipement: [relationType.oneToMany, 'ecoworking.id = equipement.ecoworking_id'],
        evaluation: [relationType.oneToMany, 'ecoworking.id = evaluation.ecoworking_id']
    },
    role: {
        user: [relationType.oneToMany, 'role.id = user.role_id']
    },
    user: {
        role: [relationType.belongsTo, 'user.role_id = role.id'],
        icon: [relationType.belongsTo, 'user.icon_id = icon.id'],
        evaluation: [relationType.oneToMany, 'user.id = evaluation.user_id']
    }
}

// La table 'mainTableName' est-elle parente de la table 'table' (relation one to many) ?
const isParent = (mainTableName, table) => {
    return dbRelations[mainTableName][table][0] === relationType.oneToMany
}

// La table 'mainTableName' est-elle parente d'au moins une table du tableau joinTables (relation one to many) ?
const hasChildren = (mainTableName, joinTables) => {
    for (let table of joinTables) {
        if (isParent(mainTableName, table.model.tableName)) return true
    }
    return false
}

module.exports = {op, dbRelations, isParent, hasChildren}