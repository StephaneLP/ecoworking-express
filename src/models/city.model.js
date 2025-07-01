const cityTableDef = {
    tableName: 'city',
    tableColumns: {
        id: {
            type: 'integer',
            nullAuthorized: false,
            autoIncrement: true,
        },
        name: {
            type: 'string',
            length: 100,
            emptyAuthorized: false,
            nullAuthorized: false,
        },
        is_active: {
            type: 'boolean',
            nullAuthorized: false,
        }
    },
    alias: {
        ville: 'name',
    }
}

module.exports = {cityTableDef}