const {isInteger, isBoolean} = require('../../utils/tools')

const checkFilter = (objColumns, arrFilter) => {
    let objConstraints, dataType

    try {
        for (let condition of arrFilter) {
            objConstraints = objColumns[condition.name]
            dataType = objConstraints.type
            switch (dataType) {
                case 'integer':
                    if (!isInteger(condition.value)) throw new Error(`Colonne : ${condition.name} / Type attendu : integer`)
                    break
                case 'string':
                    if (condition.value.lenght > objConstraints.lenght) throw new Error(`Colonne : ${condition.name} / Longueur max : ${objConstraints.lenght}`)
                    if (!objConstraints.emptyAuthorized && condition.value.lenght == 0) throw new Error(`Colonne : ${condition.name} / Empty non authorisé`)
                    break
                case 'boolean':
                    if  (!isBoolean(condition.value)) throw new Error(`Colonne : ${condition.name} / Type attendu : boolean`)
            }
            if (!objConstraints.nullAuthorized && condition.value == null) throw new Error(`Colonne : ${condition.name} / Null (ou undefined) non authorisé`)
            return {success: true}
        }
    }
    catch(err) {
        return {success: false, code: 400, msg: `${err.name} (${err.message})`}
    }
}

module.exports = {checkFilter}