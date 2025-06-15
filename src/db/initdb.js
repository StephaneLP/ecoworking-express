const mariadb = require('mariadb')
let db = {conn: null}

const initConnect = async () => {
    try {
        if(process.env.MARIADB_DATABASE === '') {
            console.log('Erreur de connexion à la BDD (nom database vide)')
            return
        }
        const conn = await mariadb.createConnection({
            host: 'localhost',
            port: process.env.MARIADB_PORT,
            user: process.env.MARIADB_USER,
            password: process.env.MARIADB_PASSWORD,
            database: process.env.MARIADB_DATABASE
        })

        // objDb.conn = conn
        db.conn = conn
        console.log(`Connexion à la BDD (threadId=${conn.threadId})`)
    } catch (err) {
        console.log(`Erreur de connexion à la BDD (err=${err})`)
    }
}

// Création de la connexion à la BDD
initConnect()

module.exports = db 
