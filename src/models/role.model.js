const role = {
    tableName: 'role',
    tableColumns: {
        id: {
            type: 'integer',
            nullAuthorized: false,
            primaryKey: true
        },
        name: {
            type: 'string',
            nullAuthorized: false,
            length: 20,
            emptyAuthorized: false,
        }
    }
}

module.exports = {role}