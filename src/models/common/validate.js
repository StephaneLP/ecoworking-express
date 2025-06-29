const {isInteger, isBoolean} = require('../../utils/tools')

const checkPathParameter = (param, columns) => {

    if (!param || !param.name || !param.op || !param.value) {
        return {success: false, msg: `La chaîne PathParameter est vide/incomplète`}
    }
    try {
        const constraint = columns[param.name]
        const dataType = constraint.type

        switch (dataType) {
            case 'integer':
                if (!isInteger(param.value)) {
                    return {success: false, method: 'checkPathParameter', msg: `Erreur type de donnée pathParameter (colonne '${param.name}', type 'integer' attendu)`}
                }
                break
            case 'string':
                if (param.value.lenght > constraint.lenght) {
                    return {success: false, method: 'checkPathParameter', msg: `Erreur longueur du pathParameter (colonne '${param.name}', string longueur max : ${constraint.lenght})`}
                }
                break
        }
        if ((dataType === 'string' && param.value.lenght == 0 )|| param.value == null) {
            return {success: false, method: 'checkPathParameter', msg: `Erreur valeur du pathParameter (colonne '${param.name}', 'null', 'undefined' et chaine vide non authorisés)`}
        }

        return {success: true}
    }
    catch(err) {
        throw new Error(`checkPathParameter - ${err.name} (${err.message})`)
    }
}

const checkQueryString = (param, columns) => {

    // if (!param || !param.name || !param.op || !param.value) {
    //     return {success: false, msg: `La chaîne PathParameter est vide/incomplète`}
    // }
    try {
        if(param) {





        }
        // const constraint = columns[param.name]
        // const dataType = constraint.type

        // switch (dataType) {
        //     case 'integer':
        //         if (!isInteger(param.value)) {
        //             return {success: false, method: 'checkPathParameter', msg: `Erreur type de donnée pathParameter (colonne '${param.name}', type 'integer' attendu)`}
        //         }
        //         break
        //     case 'string':
        //         if (param.value.lenght > constraint.lenght) {
        //             return {success: false, method: 'checkPathParameter', msg: `Erreur longueur du pathParameter (colonne '${param.name}', string longueur max : ${constraint.lenght})`}
        //         }
        //         break
        // }
        // if ((dataType === 'string' && param.value.lenght == 0 )|| param.value == null) {
        //     return {success: false, method: 'checkPathParameter', msg: `Erreur valeur du pathParameter (colonne '${param.name}', 'null', 'undefined' et chaine vide non authorisés)`}
        // }

        return {success: true}
    }
    catch(err) {
        throw new Error(`checkPathParameter - ${err.name} (${err.message})`)
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

module.exports = {checkPathParameter, checkQueryString}