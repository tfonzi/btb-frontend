import axios from 'axios'
import {useState, useEffect} from 'react'

import { readFromCache, writeToCache } from './../cache.js'
import TeamMemberAnalysis from './TeamMemberAnalysis'
import TeamAnalysis from './TeamAnalysis'



const Analysis = ({team}) => {
    

    const [teamData, setTeamData] = useState([])

    //Uses API or local storage, whichever one is available
    const getAPIData = () =>{
        var newTeam = JSON.parse(JSON.stringify(team)) //Doing a deep copy of team so that we can make changes without editing the original team array
        newTeam.map(teamMember => {
            const name = teamMember.name
            const cached = readFromCache(`https://pokeapi.co/api/v2/pokemon/${name}`)
            if(cached){
                teamMember.types = cached.types
                teamMember.stats = cached.stats
                return getAPIMoveData(teamMember)
            }
            else{
                axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
                .then(res => {
                    var pokemon = {}
                    pokemon.description = "" //Preserving format
                    pokemon.types = res.data.types.map(type => {
                        return type.type.name
                    })
                    pokemon.stats = res.data.stats.map(stat => {
                        var stat_object = {}
                        stat_object.name = stat.stat.name
                        stat_object.base_stat = stat.base_stat
                        return stat_object
                    })
                    pokemon.moves = res.data.moves.map(move => {
                        var move_object = {}
                        move_object.name = move.move.name
                        move_object.url = move.move.url
                        return move_object
                    })
                    writeToCache(`https://pokeapi.co/api/v2/pokemon/${name}`, pokemon)
                    teamMember.types = pokemon.types
                    teamMember.stats = pokemon.stats
                    return getAPIMoveData(teamMember)
                })
            }
        })
        setTeamData(newTeam)
    }

    const getAPIMoveData = (pokemon) => {
        
        var newMoves = pokemon.moves.filter(move => move !== "") //Removing blank moves
        console.log(newMoves)

        newMoves = newMoves.map(move => {
            const cached = readFromCache(`https://pokeapi.co/api/v2/move/${move}`)
            if(cached){
                return {name: move, type: cached.type.name, accuracy: cached.accuracy, damage_class: cached.damage_class.name, power: cached.power, pp: cached.pp}
            }
            else{
                axios.get(`https://pokeapi.co/api/v2/move/${move}`)
                    .then(res => {
                        writeToCache(`https://pokeapi.co/api/v2/move/${move}` ,res.data)
                        return {name: move, type: res.data.type.name, accuracy: res.data.accuracy, damage_class: res.data.damage_class.name, power: res.data.power, pp: res.data.pp}
                    })
            }
        })
        pokemon.moves = newMoves
        return pokemon
    }

    useEffect(() => {
       getAPIData()
    }, [])
    
    if(teamData){
        
        return (
            <div>
                <h3>Overview</h3>
                <TeamAnalysis team={team} />
                {teamData.map(teamMember => (
                    <TeamMemberAnalysis key={teamMember._id} teamMember={teamMember} />
                ))}
            </div>
        )
    }
    else{
        return null
    }

}





export default Analysis
