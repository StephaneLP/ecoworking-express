const mariadb = require('mariadb')
let conn = null

async function connect() {
    try {
        // Create a new connection
        conn = await mariadb.createConnection({
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '',
            database: 'ecoworking'
        });
        console.log(conn.threadId)
        // Print connection thread
        console.log(`Connexion à la BDD (threadId=${conn.threadId})`)
    } catch (err) {
        console.log(err);
    }
}

connect()



// async function asyncFunction() {
//     try {
//         // Create a new connection
//         conn = await mariadb.createConnection({
//             host: 'localhost',
//             port: '3306',
//             user: 'root',
//             password: '',
//             database: 'ecoworking'
//         });

//         // Print connection thread
//         console.log(`Connexion à la BDD (threadId=${conn.threadId})`)
//     } catch (err) {
//         console.log(err);
//     }
// }

// asyncFunction()

module.exports = conn