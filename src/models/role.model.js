const roleTableDef = {
    tableName: 'role',
    tableColumns: {
        id: {
            type: 'integer',
            nullAuthorized: false
        },
        name: {
            type: 'string',
            nullAuthorized: false,
            length: 20,
            emptyAuthorized: false,
        }
    }
}

module.exports = {roleTableDef}