const type_list = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"]

const type_order = {normal: 0, fighting: 1, flying: 2, poison: 3, ground: 4, rock: 5, bug: 6, ghost: 7, steel: 8, fire: 9, water: 10, grass: 11, electric: 12, psychic: 13, ice: 14, dragon: 15, dark: 16, fairy: 17}

const type_chart = {
    normal: [1, 1, 1, 1, 1, 0.5, 1, 0, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    fighting: [2, 1, 0.5, 0.5, 1, 2, 0.5, 0, 2, 1, 1, 1, 1, 0.5, 2, 1, 2, 0.5],
    flying: [1, 2, 1, 1, 1, 0.5, 2, 1, 0.5, 1, 1, 2, 0.5, 1, 1, 1, 1, 1,],
    poison: [1, 1, 1, 0.5, 0.5, 0.5, 1, 0.5, 0, 1, 1, 2, 1, 1, 1, 1, 1, 2,],
    ground: [1, 1, 0, 2, 1, 2, 0.5, 1, 2, 2, 1, 0.5, 2, 1, 1, 1, 1, 1,],
    rock: [1, 0.5, 2, 1, 0.5, 1, 2, 1, 0.5, 2, 1, 1, 1, 1, 2, 1, 1, 1,],
    bug: [1, 0.5, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 0.5, 1, 2, 1, 2, 1, 1, 2, 0.5,],
    ghost: [0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 1,],
    steel: [1, 1, 1, 1, 1, 2, 1, 1, 0.5, 0.5, 0.5, 1, 0.5, 1, 2, 1, 1, 2,],
    fire: [1, 1, 1, 1, 1, 0.5, 2, 1, 2, 0.5, 0.5, 2, 1, 1, 2, 0.5, 1, 1,],
    water: [1, 1, 1, 1, 2, 2, 1, 1, 1, 2, 0.5, 0.5, 1, 1, 1, 0.5, 1, 1,],
    grass: [1, 1, 0.5, 0.5, 2, 2, 0.5, 1, 0.5, 0.5, 2, 0.5, 1, 1, 1, 0.5, 1, 1,],
    electric: [1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 2, 0.5, 0.5, 1, 1, 0.5, 1, 1,],
    psychic: [1, 2, 1, 2, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 0.5, 1, 1, 0, 1,],
    ice: [1, 1, 2, 1, 2, 1, 1, 1, 0.5, 0.5, 0.5, 2, 1, 1, 0.5, 2, 1, 1,],
    dragon: [1, 1, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1, 2, 1, 0,],
    dark: [1, 0.5, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 0.5,],
    fairy: [1, 2, 1, 0.5, 1, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 2, 2, 1,]
}


const findTypeEffects = (types, position) => { //position refers to "attacking" or "defending"

    if(position === "attacking"){
        
        let strongAgainst = []
        let weakAgainst = []
        let noEffect = []
    
        let type = types[0]
        let offensive_chart = type_chart[type]

        for(let i = 0; i < offensive_chart.length; i++){
            let chart_value = offensive_chart[i]
            if(chart_value == 2){
                strongAgainst.push(type_list[i])
            }
            else if(chart_value == 0.5){
                weakAgainst.push(type_list[i])
            }
            else if(chart_value == 0){
                noEffect.push(type_list[i])
            }
        }

        return {strongAgainst: strongAgainst, weakAgainst: weakAgainst, noEffect: noEffect}

    }
    else if(position === "defending"){

        if(types.length == 1){
            let resists = []
            let weakAgainst = []
            let immune = []

            let index = type_order[types[0]]
            for(let i = 0; i < type_list.length; i++){
                let type_row = type_chart[type_list[i]]
                let chart_value = type_row[index]
                if(chart_value == 2){
                    weakAgainst.push(type_list[i])
                }
                else if(chart_value == 0.5){
                    resists.push(type_list[i])
                }
                else if(chart_value == 0){
                    immune.push(type_list[i])
                }
            }
            return {weakAgainst: weakAgainst, resists: resists, immune: immune}
        }
        else if(types.length == 2){
            let resists = []
            let weakAgainst = []
            let immune = []
            let index_1 = type_order[types[0]]
            let index_2 = type_order[types[1]]
            for(let i = 0; i < type_list.length; i++){
                let type_row = type_chart[type_list[i]]
                let chart_value = type_row[index_1] * type_row[index_2]
                if(chart_value == 2 || chart_value == 4){
                    weakAgainst.push({type: type_list[i], multiplier: chart_value})
                }
                else if(chart_value == 0){
                    immune.push({type: type_list[i], multiplier: chart_value})
                }
                else if(chart_value == 0.5 || chart_value == 0.25){
                    resists.push({type: type_list[i], multiplier: chart_value})
                }
            }
            return {weakAgainst: weakAgainst, resists: resists, immune: immune}
        }
    }
    else{
        console.log("Invalid position for TypeEffect")
        return
    }
}

export {findTypeEffects}