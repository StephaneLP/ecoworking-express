const user = {
    tableName: 'user',
    tableColumns: {
        id: {
            type: 'integer',
            nullAuthorized: false,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: 'string',
            nullAuthorized: false,
            length: 254,
            emptyAuthorized: false,
        },
        nickname: {
            type: 'string',
            nullAuthorized: false,
            length: 10,
            emptyAuthorized: false,
        },
        is_verified: {
            type: 'boolean',
            nullAuthorized: false,
        },
        password: {
            type: 'string',
            nullAuthorized: false,
            length: 254,
            emptyAuthorized: false,
        },
        icon_color: {
            type: 'string',
            nullAuthorized: false,
            length: 7,
            emptyAuthorized: false,
        },
        role_id: {
            type: 'integer',
            nullAuthorized: false,
            foreignKey: true
        },
        icon_id: {
            type: 'integer',
            nullAuthorized: false,
            foreignKey: true
        }
    },
    dateColumns: {
        createDate: 'created_at',
        updateDate: 'updated_at'
    }
}

module.exports = {user}