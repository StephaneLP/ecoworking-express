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
    }
}

const isParentTable = (mainTableName, table) => {
    return dbRelations[mainTableName][table][0] === relationType.oneToMany
}

module.exports = {op, dbRelations, isParentTable}