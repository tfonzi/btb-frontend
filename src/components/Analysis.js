import axios from 'axios'
import {useState, useEffect} from 'react'

import { readFromCache, writeToCache } from './../cache.js'
import TeamMemberAnalysis from './TeamMemberAnalysis'
import TeamAnalysis from './TeamAnalysis'



const Analysis = ({team}) => {
    

    const [teamData, setTeamData] = useState([])


    const getAPIData = () => {
        
        var newTeam = JSON.parse(JSON.stringify(team)) //Doing a deep copy of team so that we can make changes without editing the original team array

        let caches_promises = []

        newTeam.map(teamMember => {
            const cached_pokemon = readFromCache(`https://pokeapi.co/api/v2/pokemon/${teamMember.name}`)
            if(cached_pokemon){ //If pokemon is in cache, just get data from there
                cached_pokemon.name = teamMember.name
                caches_promises.push(cached_pokemon)
            }
            else{ //Else, do API call
                let promise = axios.get(`https://pokeapi.co/api/v2/pokemon/${teamMember.name}`)
                caches_promises.push(promise)
            }

            var filtered_moves = teamMember.moves.filter(move => move !== "") //Removing blank moves
            filtered_moves.map(move =>{
                const cached_move = readFromCache(`https://pokeapi.co/api/v2/move/${move}`)
                if(cached_move){ //If move is in cache, get data from there
                    caches_promises.push(cached_move)
                }
                else{ //Else, do API call
                    let promise = axios.get(`https://pokeapi.co/api/v2/move/${move}`)
                    caches_promises.push(promise)
                }
            })
        })

        let cache_promise_map = Array(caches_promises.length).fill(0) //mapping for cache/promises. 0 = cached. 1 = promise
        for(let i = 0; i < cache_promise_map.length; i++){
            let cache_promise = caches_promises[i]
            if(Promise.resolve(cache_promise) == cache_promise){ //Checks if promise
                cache_promise_map[i] = 1
            }
        }

         axios.all(caches_promises)
            .then(resArr => {

                let curr_name = ""
                let curr_pokemon = {}
                let curr_moveset = []
                let firstPokemon = true;

                while(resArr.length != 0){

                    let res = resArr.shift()
                    let promise_check = cache_promise_map.shift()

                    if(promise_check == 1){ //Is promise
                        
                        let data = res.data
                        if('damage_class' in data){ //must be move api data
                            let curr_move_name = data.name
                            let curr_move = curr_pokemon.moves.find(move => move.name === curr_move_name)
                            curr_move = {}
                            curr_move.name = curr_move_name
                            curr_move.type = data.type.name
                            curr_move.accuracy = data.accuracy
                            curr_move.damage_class = data.damage_class.name
                            curr_move.power = data.power
                            curr_move.pp = data.pp
                            curr_move.description = data.effect_entries[0].effect
                            
                            curr_moveset.push(curr_move)

                            if(resArr.length === 0){ //Means that the previous move was the last promise/cached, so you must assign as an end case
                                curr_pokemon.moves = curr_moveset
                            }

                            //Write to cache to speed up following api calls
                            writeToCache(`https://pokeapi.co/api/v2/move/${curr_move_name}`, data)
                        }
                        else{ //must be pokemon api data
                            //Adding previously populated move_set to pokemon before moving on to the next one UNLESS it is the first pokemon (Based on started)
                            if(!firstPokemon){
                                curr_pokemon.moves = curr_moveset
                                curr_moveset = []
                            }
            
                            //Adding stats and types to specific pokemon in newTeam 
                            curr_name = data.name
                            curr_pokemon = newTeam.find(teamMember => teamMember.name === curr_name)
                            let type_object = data.types.map(type => {
                                return type.type.name
                            })
                            let stat_object = data.stats.map(stat => {
                                var object = {}
                                object.name = stat.stat.name
                                object.base_stat = stat.base_stat
                                return object
                            })
                            curr_pokemon.types = type_object
                            curr_pokemon.stats = stat_object

                            //Write to cache to speed up following api calls
                            var to_be_cached = {}
                            to_be_cached.description = "" //Preserving format
                            to_be_cached.types = data.types.map(type => {
                                return type.type.name
                            })
                            to_be_cached.stats = data.stats.map(stat => {
                                var stat_object = {}
                                stat_object.name = stat.stat.name
                                stat_object.base_stat = stat.base_stat
                                return stat_object
                            })
                            to_be_cached.moves = data.moves.map(move => {
                                var move_object = {}
                                move_object.name = move.move.name
                                move_object.url = move.move.url
                                return move_object
                            })
                            firstPokemon = false;
                            writeToCache(`https://pokeapi.co/api/v2/pokemon/${curr_name}`, to_be_cached)
                        }
  
                    }
                    else{ //Is not promise
                        let data = res
                        if('damage_class' in data){ //must be move api data
                            let curr_move_name = data.name
                            let curr_move = curr_pokemon.moves.find(move => move.name === curr_move_name)
                            curr_move = {}
                            curr_move.name = curr_move_name
                            curr_move.type = data.type.name
                            curr_move.accuracy = data.accuracy
                            curr_move.damage_class = data.damage_class.name
                            curr_move.power = data.power
                            curr_move.pp = data.pp
                            curr_move.description = data.effect_entries[0].effect

                            curr_moveset.push(curr_move)

                            if(resArr.length === 0){ //Means that the previous move was the last promise/cached, so you must assign as an end case
                                curr_pokemon.moves = curr_moveset
                            }

                        }
                        else{ //must be pokemon api data
                             //Adding previously populated move_set to pokemon before moving on to the next one UNLESS it is the first pokemon (Based on started)
                             if(!firstPokemon){
                                curr_pokemon.moves = curr_moveset
                                curr_moveset = []
                            }

                            //Adding stats and types to specific pokemon in newTeam 
                            curr_name = data.name
                            curr_pokemon = newTeam.find(teamMember => teamMember.name === curr_name)                            
                            curr_pokemon.types = data.types
                            curr_pokemon.stats = data.stats
                            firstPokemon = false;
                        }
                    }
                }
                
                setTeamData(newTeam)
                
            })
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
        return (<p>Is Loading ...</p>)
    }

}





export default Analysis
