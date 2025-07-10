const log = require('../utils/log')
const mariadb = require('mariadb')

const pool = mariadb.createPool({
     host: process.env.DB_HOST,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_DATABASE,
     port: process.env.DB_PORT,
     bigIntAsNumber: true,
     connectionLimit: 5
})

const testConnect = async () => {
    let conn;
    try {
        conn = await pool.getConnection();
        log.addEvent(`Connexion à la BDD (threadId=${conn.threadId})`)
    } catch (err) { 
        log.addError(`Erreur de connexion à la BDD (err=${err})`)
    } finally {
        if (conn) conn.end()
    }
}

// Test de la connexion à la BDD
testConnect()

module.exports = pool