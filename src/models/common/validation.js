const {isInteger, isBoolean} = require('../../utils/tools')

const checkPathParameter = (param, columns) => {
    try {
        const constraint = columns[param.name]
        const dataType = constraint.type

        switch (dataType) {
            case 'integer':
                if (!isInteger(param.value)) throw new Error(`Colonne : ${param.name} / Type attendu : integer`)
                break
            case 'string':
                if (param.value.lenght > constraint.lenght) throw new Error(`Colonne : ${param.name} / Longueur max : ${constraint.lenght}`)
                break
        }
        if ((dataType === 'string' && param.value.lenght == 0 )|| param.value == null) throw new Error(`Colonne : ${param.name} / Null, Undefined, Empty non authorisés`)
    }
    catch(err) {
        throw new Error(`${err.name} (${err.message})`)
    }
}


// const checkFilter = (columns, arrFilter) => {
//     let constraint, dataType

//     try {
//         for (let param of arrFilter) {
//             constraint = columns[param.name]
//             dataType = constraint.type
//             switch (dataType) {
//                 case 'integer':
//                     if (!isInteger(param.value)) throw new Error(`Colonne : ${param.name} / Type attendu : integer`)
//                     break
//                 case 'string':
//                     if (param.value.lenght > constraint.lenght) throw new Error(`Colonne : ${param.name} / Longueur max : ${constraint.lenght}`)
//                     if (!constraint.emptyAuthorized && param.value.lenght == 0) throw new Error(`Colonne : ${param.name} / Empty non authorisé`)
//                     break
//                 case 'boolean':
//                     if  (!isBoolean(param.value)) throw new Error(`Colonne : ${param.name} / Type attendu : boolean`)
//             }
//             if (!constraint.nullAuthorized && param.value == null) throw new Error(`Colonne : ${param.name} / Null (ou undefined) non authorisé`)
//         }
//     }
//     catch(err) {
//         throw new Error(`${err.name} (${err.message})`)
//     }
// }

module.exports = {checkPathParameter}