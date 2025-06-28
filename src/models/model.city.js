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
            lenght: 100,
            emptyAuthorized: false,
            nullAuthorized: false,
        },
        is_active: {
            type: 'boolean',
            nullAuthorized: false,
        }
    }
}

module.exports = {cityTableDef}