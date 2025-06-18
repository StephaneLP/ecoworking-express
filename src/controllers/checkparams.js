const log = require('../utils/log')

const checkParams = (model, datas) => {
    try{
        for (let key in datas) {
            const objColumn = model[key]

            
            
            console.log('OBJET', objColumn)




        }        
    }
    catch(err) {
        log.addError(`checkParams - 400 - ${err}`)
    }

}

module.exports = checkParams