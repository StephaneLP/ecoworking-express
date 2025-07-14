const cityTableDef = {
    tableName: 'city',
    tableColumns: {
        id: {
            type: 'integer',
            nullAuthorized: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: 'string',
            nullAuthorized: false,
            length: 100,
            emptyAuthorized: false
        },
        is_active: {
            type: 'boolean',
            nullAuthorized: false
        },
        test: {
            type: 'string',
            nullAuthorized: true
        }
    },
    dateColumns: {
        createDate: 'created_at',
        updateDate: 'updated_at'
    }
}

module.exports = {cityTableDef}