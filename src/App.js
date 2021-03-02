import {useState, useEffect} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import axios from 'axios';

import MenuBar from './components/MenuBar'
import Team from './components/Team'
import Berries from './components/Berries'
import PokemonCatalog from './components/PokemonCatalog'
import Inspector from './components/Inspector'
import Box from './components/Box'
import Debug from './components/Debug'

import 'bootstrap/dist/css/bootstrap.min.css';
import "./components/components.css"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'



const App = () => {
  
  const [teamBerriesToggle, setTeamBerriesToggle] = useState("teamView") //Toggles lefthand view between berries and team
  const [inspectView, setInspectView] = useState("") //This variable toggles between inspect views
  const [inspectData, setInspectData] = useState(null) //This variable holds data that goes into inspect window
  const [team, setTeam] = useState([])
  const [box, setBox] = useState([])
  const [berryCatalog, setBerryCatalog] = useState([])
  const [pokemonCatalog, setPokemonCatalog] = useState([])
  const [active, setActive] = useState(null)
  const [pCScrollState, setPCScrollState] = useState(0)
  const [teamScrollState, setTeamScrollState] = useState(0)
  const [boxScrollState, setBoxScrollState] = useState(0)
  const [berryScrollState, setBerryScrollState] = useState(0)


  const backend_url = "https://btb-backend.azurewebsites.net"
  //const backend_url = "http://localhost:5000"

  

  useEffect(() => {

    const getBerryCatalog = async () => {
      const berriesFromServer = await fetchBerryCatalog()
      setBerryCatalog(berriesFromServer)
    }

    const getBox = async () => {
      const boxobjects = await fetchBox()
      setBox(boxobjects)
    }

    const getTeam = async () => {
      const teamObjects = await fetchTeam()
      setTeam(teamObjects)
    }

    const getPokemonCatalog = () => {
      
      axios.get("https://pokeapi.co/api/v2/pokemon/")
        .then( res => {
          //const count = res.data.count
          const count = 898
          axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=${count}`)
            .then(res2 =>{
              const pokemons = res2.data.results
              var id = 1
              for(id = 1; id <= count; id++){
                pokemons[id - 1].id = id
                pokemons[id - 1].image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
              }
              setPokemonCatalog(pokemons)
            })
        })
    }


    getBerryCatalog()
    getBox()
    getTeam()
    getPokemonCatalog()
  }, [])


  /*API Functions ==============================================================================================================*/

  const fetchBerryCatalog = async () => {
    const res = await axios.get(`${backend_url}/berries`)
    return res.data
  }

  const fetchBox = async () => {
    const res = await axios.get(`${backend_url}/box`)
    return res.data
  }

  const fetchTeam = async () => {
    const res = await axios.get(`${backend_url}/team`)
    return res.data
  }

  const addBerryToCatalog = (berry) => {
    axios.post(`${backend_url}/berries`, berry)
      .then(res =>{
            setBerryCatalog([...berryCatalog, res.data])
      })
  }

  const addObjToBox = (obj) => {
    axios.post(`${backend_url}/box`, obj)
      .then(res =>{
            setBox([...box, res.data])
      })
  }

  const addObjToTeam = (obj) => {
    if(team.length >= 6){
      console.log("Cancelled action due to team being full")
      alert("Cannot add more than 6 members to team.")
      return
    }

    axios.post(`${backend_url}/team`, obj)
      .then(res =>{
            setTeam([...team, res.data])
      })
  }

  const removeObjfromTeam = (id) => {
    axios.delete(`${backend_url}/team/${id}`)
      .then(res =>{
        setInspectView("")
        setTeam(team.filter((obj) => obj._id != id))
      })
  }

  const removeObjfromBox = (id) => {
    axios.delete(`${backend_url}/box/${id}`)
      .then(res =>{
        setInspectView("")
        setBox(box.filter((obj) => obj._id != id))
      }) 
  }

  const removeObj = (id, source) => {

    switch(source){
      case "box": {
        console.log(`Removing id ${id} from Box.`)
        removeObjfromBox(id)
        break
      }
      case "team": {
        console.log(`Removing id ${id} from Team.`)
        removeObjfromTeam(id)
        break
      }
      default:{
        alert("No valid source specified")
        break
      }
    }
  }

  const fetchBoxObj = async (id) => {
    const res = await axios.get(`${backend_url}/box/${id}`)
    return res.data
  }

  const fetchTeamObj = async (id) => {
    const res = await axios.get(`${backend_url}/team/${id}`)
    return res.data
  }

  const moveTo = async (id, source, destination) => {
    
    if(source == destination){
      return //Nothing Happens
    }

    if(destination == "team"){
      if(team.length >= 6){
        console.log("Cancelled action due to team being full")
        alert("Cannot add more than 6 members to team.")
        return
      }
    }

    const body = {source, destination}

    axios.post(`${backend_url}/${id}`, body)
      .then(res =>{
          if(source == "box"){
            setBox(box.filter((obj) => obj._id != id))

            if(destination == "team"){
              setTeam([...team, res.data])
              setInspectView("inspectTeam")
              setInspectData(res.data)
              setActive(`team ${res.data._id}`)
            }
          }
          else if(source == "team"){
            setTeam(team.filter((obj) => obj._id != id))
           
            if(destination == "box"){
              setBox([...box, res.data])
              setInspectView("inspectBox")
              setInspectData(res.data)
              setActive(`box ${res.data._id}`)
            }
          }
      })
  }

  const updateNickname = async (source, id, nickname) => {
    switch (source){
      case "box":{
        var copy = box.find((obj) => obj._id == id)
        copy.nickname = nickname

        axios.patch(`${backend_url}/box/${id}`, copy)
          .then(res =>{
            setBox(box.map(
              (obj) => obj.id === id //For every obj, if obj._id equals id
              ? {...obj, nickname: res.nickname }  //Update obj nickname
              : obj) //Else, leave obj as is
              )
          })
        break
      }

      case "team":{
        var copy = team.find((obj) => obj._id == id)
        copy.nickname = nickname

        axios.patch(`${backend_url}/team/${id}`, copy)
          .then(res =>{
            setTeam(team.map(
              (obj) => obj.id === id //For every obj, if obj._id equals id
              ? {...obj, nickname: res.nickname }  //Update obj nickname
              : obj) //Else, leave obj as is
              )
          })
        break
      }

      default:
        alert("Source Error in updating nickname.")
    }
  }

  /*View and Inspect Functions ==============================================================================================================*/
  const changeViewToTeams = () => {
    updateScrollState()
    setTeamBerriesToggle("teamView")
  }

  const changeViewToBerries = () => {
    updateScrollState()
    setTeamBerriesToggle("berryCatalogView")
  }

  const changeViewToPokemonCatalog = () => {
    updateScrollState()
    setTeamBerriesToggle("pokemonCatalogView")
  }

  const updateScrollState = () => {
    var el = ""
    switch (teamBerriesToggle) {
      case "teamView":
          el = document.getElementById("TeamScroll")
          setTeamScrollState(el.scrollTop)
        break

      case "berryCatalogView":{}
          el = document.getElementById("BerryScroll")
          setBerryScrollState(el.scrollTop)
        break

      case "pokemonCatalogView":
        el = document.getElementById("PCScroll")
        setPCScrollState(el.scrollTop)
        break

    }
  }

  const inspectBerry = (id) => {
    const data = berryCatalog.find(berry => berry._id == id)
    updateScrollState()
    setInspectData(data)
    setInspectView("inspectBerryCatalog")
    setActive(`berryCatalog ${id}`)
  }

  const inspectPokemonCatalog =  (id) => {
    
    axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
          .then(res => {
            var pokemon = {}
            pokemon.name = res.data.name
            pokemon.image = res.data.sprites.front_default
            pokemon.types = res.data.types.map(type => {
              return type.type.name
            })
            pokemon.stats = res.data.stats.map(stat => {
              var stat_object = {}
              stat_object.name = stat.stat.name
              stat_object.base_stat = stat.base_stat
              return stat_object
            })
            inspectPokeCatalogCallback(pokemon, res.data.id)
          })
  }

  const inspectPokeCatalogCallback =  (object, id) => {
    updateScrollState()
    setInspectData(object)
    setInspectView("inspectPokemonCatalog")
    setActive(`pokemonCatalog ${id}`)
  }

  const inspectBox = (id) => {
    const data = box.find(obj => obj._id == id)
    updateScrollState()
    setInspectData(data)
    setInspectView("inspectBox")
    setActive(`box ${id}`)
  }

  const inspectTeam = (id) => {
    const data = team.find(obj => obj._id == id)
    updateScrollState()
    setInspectData(data)
    setInspectView("inspectTeam")
    setActive(`team ${id}`)
  }

/*Mouse Events ==============================================================================================================*/
  const onDragStart = (ev, id, source) => {
    ev.dataTransfer.setData("id", id)
    ev.dataTransfer.setData("source", source)
  } 

  const onDragOver = (ev) => {
    ev.preventDefault()
  }

  const onDrop = (e, source, id, dest) => {

    e.preventDefault()
    
    if(source == dest){
      return //Do nothing if this is the case
    }
    console.log(`Dragged object with id ${id} from ${source} to ${dest}.`)

    //Check Destination
    if(dest == "inspector"){
      if(source == "berryCatalog"){
        inspectBerry(id)
      }
      else if(source == "pokemonCatalog"){
        inspectPokemonCatalog(id)
      }
      else if(source == "box"){
        inspectBox(id)
      }
      else if(source == "team"){
        inspectTeam(id)
      }
      return
    }

    //If the dest isn't the inspector, then the user must be dragging object to move to different container
    
    //Performs deep copy for if source is berryCatalog. (If source is "box" or "team", copy is made in moveTo function)
    var obj = null
    var copy = null
    if(source == "berryCatalog"){
        obj = berryCatalog.find((berry) => berry._id == id)
        copy = JSON.parse(JSON.stringify(obj)) //creates deep copy of original obj
        copy.type = "berry"
        copy.nickname = ""
        delete copy.id //Id gets rewritten when moving between containers
    }


    //Destination decision
    switch(dest){

      case "box": {
        console.log(`Adding obj ${id} from ${source} to box.`)
        if(source != "berryCatalog"){
          moveTo(id, source, dest)
        }
        else{
          addObjToBox(copy)
        }
        return
      }

      case "team":{
        console.log(`Adding obj ${id} from ${source} to team.`)
        if(source != "berryCatalog"){
          moveTo(id, source, dest)
        }
        else{
          addObjToTeam(copy)
        }   
        return
      }

      default:
        alert("No valid source specified")
        break
    }
  }

  /*App Structure ==============================================================================================================*/

  return (
    <div>
      <Router>
        <Route path='/' exact render={(props) => (
          <>
            <div className="menuBar">
              <MenuBar berryView={changeViewToBerries} teamView={changeViewToTeams} pokemonCatalogView={changeViewToPokemonCatalog} />
            </div>
            <Container fluid className="topSideView">
              <Row noGutters="true">
                <Col xs={4} md={6}> {/*Natively one column is 25% while the other is 75%. On desktop, it switches to 50-50 */}
                  <div className="leftSideView">
                    {(teamBerriesToggle == "teamView") && <Team active={active} scrollState={teamScrollState} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} inspect={inspectTeam} team={team} />}
                    {(teamBerriesToggle == "berryCatalogView") && <Berries active={active} scrollState={berryScrollState} onDragStart={onDragStart} inspect={inspectBerry} berries={berryCatalog} />}
                    {(teamBerriesToggle == "pokemonCatalogView") && <PokemonCatalog active={active} scrollState={pCScrollState} onDragStart={onDragStart} inspect={inspectPokemonCatalog} pokemons={pokemonCatalog} />} 
                  </div>
                </Col>
                <Col xs={8} md={6}>
                  <div className="rightSideView">
                    <Inspector onDragOver={onDragOver} onDrop={onDrop} view={inspectView} object={inspectData} updateNickname={updateNickname} AddObjectToBox={addObjToBox} AddObjectToTeam={addObjToTeam} removeObj={removeObj} />
                  </div>
                </Col>
              </Row>
            </Container>
            <Container fluid>
              <Box active={active} scrollState={boxScrollState} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} inspect={inspectBox} box={box} />
            </Container> 
          </>
          )} />
        <Route path='/debug' exact render={(props) => (
          <Debug addBerry={addBerryToCatalog}/>
        )}/>
      </Router>
    </div>
  );
}

export default App;
