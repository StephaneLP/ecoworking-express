const log = require('../utils/log')
const mariadb = require('mariadb')
let db = {conn: null}

const initConnect = async () => {
    if(process.env.MARIADB_DATABASE === '') {
        log.addError('Erreur de connexion à la BDD (nom database vide)')
        return
    }
    try {
         const conn = await mariadb.createConnection({
            host: 'localhost',
            port: process.env.MARIADB_PORT,
            user: process.env.MARIADB_USER,
            password: process.env.MARIADB_PASSWORD,
            database: process.env.MARIADB_DATABASE,
            bigIntAsNumber: true,
        })

        // objDb.conn = conn
        db.conn = conn
        log.addEvent(`Connexion à la BDD (threadId=${conn.threadId})`)
    } catch (err) {
        log.addError(`Erreur de connexion à la BDD (err=${err})`)
    }
}

// Création de la connexion à la BDD
initConnect()

module.exports = db 
