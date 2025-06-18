const log = require('../utils/log')

const checkParams = (model, datas) => {
    try{
        for (let key in datas) {
            const objColumn = model[id1]

            
            console.log('OBJET', objColumn)




        }        
    }
    catch(err) {
        log.addError(`checkParams - 400 - ${err}`)
    }

}

module.exports = checkParams