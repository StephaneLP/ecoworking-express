const mariadb = require('mariadb')
const objConn = {connexion: null}

async function initConnect() {
    try {
        // Create a new connection
        const conn = await mariadb.createConnection({
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '',
            database: 'ecoworking'
        })
        objConn.connexion = conn

        // Print connection thread
        console.log(`Connexion à la BDD (threadId=${conn.threadId})`)
    } catch (err) {
        console.log(`Erreur de connexion à la BDD (err=${err})`);
    }
}

module.exports = { initConnect, objConn }