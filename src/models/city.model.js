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
            nullAuthorized: false,
            length: 100,
            emptyAuthorized: false,
        },
        is_active: {
            type: 'boolean',
            nullAuthorized: false,
        }
    }
}

module.exports = {cityTableDef}