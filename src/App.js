import {useState, useEffect} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import axios from 'axios'
import { useAuth0 } from "@auth0/auth0-react";
import { v4 as uuidv4 } from 'uuid';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import MenuBar from './components/structure/MenuBar'
import Help from './components/structure/Help'
import PostLogin from './components/structure/PostLogin'

import Team from './components/containers/Team'
import PokemonCatalog from './components/containers/PokemonCatalog'
import ItemCatalog from './components/containers/ItemCatalog'
import Box from './components/containers/Box'

import Analysis from './components/analysis/Analysis'

import Inspector from './components/inspector/Inspector'

import 'bootstrap/dist/css/bootstrap.min.css'
import "./App.css"

import { readFromCache, writeToCache } from './utils/cache.js'

const App = () => {
  
  const [teamBerriesToggle, setTeamBerriesToggle] = useState("pokemonCatalogView") //Toggles lefthand view between berries and team
  const [inspectView, setInspectView] = useState("") //This variable toggles between inspect views
  const [inspectData, setInspectData] = useState(null) //This variable holds data that goes into inspect window
  const [inspectDataAPI, setInspectDataAPI] = useState({types: 0, stats: null, description: ""})//This variable holds inspect data fetched from api
  const [team, setTeam] = useState([])
  const [box, setBox] = useState([])
  const [berryCatalog, setBerryCatalog] = useState([])
  const [pokemonCatalog, setPokemonCatalog] = useState([])
  const [itemCatalog, setItemCatalog] = useState([])
  const [active, setActive] = useState(null)
  const [pCScrollState, setPCScrollState] = useState(0)
  const [itemScrollState, setItemScrollState] = useState(0)
  const [teamScrollState, setTeamScrollState] = useState(0)
  const [boxScrollState, setBoxScrollState] = useState(0)
  const [analysis, setAnalysis] = useState(false)
  const [help, setHelp] = useState(false)
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();


  const backend_url = "https://btb-backend.azurewebsites.net"
  //const backend_url = "http://localhost:5000"

  useEffect(() => {

    const getUser = async () => {
      const domain = "dev-1odthoac.us.auth0.com";
  
      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        });
  
      } catch (e) {
        console.log(e.message);
      }
    };

    const getBoxFromLocalStorage = () => {
      const boxObjects = readFromCache("guest_box")
      if(boxObjects){
        setBox(boxObjects)
      }
    }

    const getTeamFromLocalStorage = () => {
      const teamObjects = readFromCache("guest_team")
      if(teamObjects){
        setTeam(teamObjects)
      }
    }

    const getBoxFromDB = async () => {
      const boxobjects = await fetchBox()
      setBox(boxobjects)
    }

    const getTeamFromDB = async () => {
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

    const getItemCatalog = () => {
      
      axios.get("https://pokeapi.co/api/v2/item-attribute/7/")
        .then(res => {
            var items = res.data.items
            for (var i = 0; i < items.length; i++){
              items[i].image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${items[i].name}.png`
            }
            setItemCatalog(items)
        })
    }

    getUser()

    if(user && isAuthenticated){
      getBoxFromDB()
      getTeamFromDB()
    }
    else{
      getBoxFromLocalStorage()
      getTeamFromLocalStorage()
    }

    getPokemonCatalog()
    getItemCatalog()
  }, [user, isAuthenticated])


  const updateBox = (new_box) => {
    setBox(new_box)
  }

  /*API Functions ==============================================================================================================*/

  const fetchBox = async () => {
    const userId = user.sub.replace('|', '_')
    const res = await axios.get(`${backend_url}/${userId}/box`)
    return res.data
  }

  const fetchTeam = async () => {
    const userId = user.sub.replace('|', '_')
    const res = await axios.get(`${backend_url}/${userId}/team`)
    return res.data
  }

  const addObjToBox = (obj) => {
    if(user && isAuthenticated) {
      const userId = user.sub.replace('|', '_')
      axios.post(`${backend_url}/${userId}/box`, obj)
        .then(res =>{
              setBox([...box, res.data])
        })
    }
    else{
      //Setting up local object
      obj.description = ""
      obj.moves = ["", "", "", ""]
      obj._id = uuidv4() //Generate unique ID
      delete obj.url
      writeToCache("guest_box", [...box, obj])
      setBox([...box, obj])
    }
  }

  const addObjToTeam = (obj) => {
    if(team.length >= 6){
      console.log("Cancelled action due to team being full")
      alert("Cannot add more than 6 members to team.")
      return
    }

    if(obj.type === "item"){
      console.log("Cancelled action due to trying to add item to team")
      alert("Cannot add an item as a team member.")
    }

    if(user && isAuthenticated) {
      const userId = user.sub.replace('|', '_')
      axios.post(`${backend_url}/${userId}/team`, obj)
        .then(res =>{
              setTeam([...team, res.data])
        })
    }
    else{
      //Setting up local object
      obj.description = ""
      obj.moves = ["", "", "", ""]
      obj._id = uuidv4() //Generate unique ID
      delete obj.url
      writeToCache("guest_team", [...team, obj])
      setTeam([...team, obj])
    }
  }

  const removeObjfromTeam = (id) => {
    if(user && isAuthenticated) {
      const userId = user.sub.replace('|', '_')
      axios.patch(`${backend_url}/${userId}/team/delete/${id}`)
        .then(res =>{
          setInspectView("")
          setTeam(team.filter((obj) => obj._id != id))
        })
    }
    else{
      writeToCache("guest_team", team.filter((obj) => obj._id != id))
      setInspectView("")
      setTeam(team.filter((obj) => obj._id != id))
    }
  }

  const removeObjfromBox = (id) => {
    if(user && isAuthenticated) {
      const userId = user.sub.replace('|', '_')
      axios.patch(`${backend_url}/${userId}/box/delete/${id}`)
        .then(res =>{
          setInspectView("")
          setBox(box.filter((obj) => obj._id != id))
        }) 
    }
    else{
      writeToCache("guest_box", box.filter((obj) => obj._id != id))
      setInspectView("")
      setBox(box.filter((obj) => obj._id != id))
    }
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
    const userId = user.sub.replace('|', '_')
    const res = await axios.get(`${backend_url}/${userId}/box/${id}`)
    return res.data
  }

  const fetchTeamObj = async (id) => {
    const userId = user.sub.replace('|', '_')
    const res = await axios.get(`${backend_url}/${userId}/team/${id}`)
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

      if(source == "box"){
        const item_check = box.find((obj) => obj._id == id)

        if(item_check.type == "item"){
          console.log("Cancelled action due to trying to add item to team")
          alert("Cannot add an item as a team member.")
          return
        }
      }
    }

    const body = {source, destination}
    if(user && isAuthenticated){
      const userId = user.sub.replace('|', '_')
      axios.patch(`${backend_url}/${userId}/${id}`, body)
        .then(res =>{
            if(source == "box"){
              setBox(box.filter((obj) => obj._id != id))

              if(destination == "team"){
                setTeam([...team, res.data])
                updateScrollState()
                setInspectData(res.data)
                fetchInspectDataAPI(res.data.name, res.data.type)
                setActive(`team ${res.data._id}`)
                setInspectView("inspectTeam")
              }
            }
            else if(source == "team"){
              setTeam(team.filter((obj) => obj._id != id))
              
              if(destination == "box"){
                setBox([...box, res.data])
                updateScrollState()
                setInspectData(res.data)
                fetchInspectDataAPI(res.data.name, res.data.type)
                setActive(`box ${res.data._id}`)
                setInspectView("inspectBox")
              }
            }
        })
    }
    else{
      if(source == "box"){
        const boxObj = box.find((obj) => obj._id == id)
        setBox(box.filter((obj) => obj._id != id))
        writeToCache("guest_box", box.filter((obj) => obj._id != id))

        if(destination == "team"){
          setTeam([...team, boxObj])
          writeToCache("guest_team", [...team, boxObj])
          updateScrollState()
          setInspectData(boxObj)
          fetchInspectDataAPI(boxObj.name, boxObj.type)
          setActive(`team ${boxObj._id}`)
          setInspectView("inspectTeam")
        }
      }
      else if(source == "team"){
        const teamObj = team.find((obj) => obj._id == id)
        setTeam(team.filter((obj) => obj._id != id))
        writeToCache("guest_team", team.filter((obj) => obj._id != id))
        
        if(destination == "box"){
          setBox([...box, teamObj])
          writeToCache("guest_box", [...box, teamObj])
          updateScrollState()
          setInspectData(teamObj)
          fetchInspectDataAPI(teamObj.name, teamObj.type)
          setActive(`box ${teamObj._id}`)
          setInspectView("inspectBox")
        }
      }
    }
    
  }

  const updateNickname = async (source, id, nickname) => {
    var userId = ""
    if(user && isAuthenticated){
      userId= user.sub.replace('|', '_')
    }

    switch (source){
      case "box":{
        var copy = box.find((obj) => obj._id == id)
        copy.nickname = nickname
        if(user && isAuthenticated){
          axios.patch(`${backend_url}/${userId}/box/update/${id}`, copy)
            .then(res =>{
              setBox(box.map(
                (obj) => obj.id === id //For every obj, if obj._id equals id
                ? {...obj, nickname: res.nickname }  //Update obj nickname
                : obj) //Else, leave obj as is
                )
            })
        }
        else{
          const newBox = box.map(
            (obj) => obj.id === id //For every obj, if obj._id equals id
            ? {...obj, nickname: nickname }  //Update obj nickname
            : obj) //Else, leave obj as is
          writeToCache("guest_box", newBox)
          setBox(newBox)
        }
        break
      }

      case "team":{
        var copy = team.find((obj) => obj._id == id)
        copy.nickname = nickname

        if(user && isAuthenticated){
          axios.patch(`${backend_url}/${userId}/team/update/${id}`, copy)
            .then(res =>{
              setTeam(team.map(
                (obj) => obj.id === id //For every obj, if obj._id equals id
                ? {...obj, nickname: res.nickname }  //Update obj nickname
                : obj) //Else, leave obj as is
                )
            })
        }
        else{
          const newTeam = team.map(
            (obj) => obj.id === id //For every obj, if obj._id equals id
            ? {...obj, nickname: nickname }  //Update obj nickname
            : obj) //Else, leave obj as is
          writeToCache("guest_team", newTeam)
          setTeam(newTeam)
        }
        break
      }

      default:
        alert("Source Error in updating nickname.")
    }
  }

  const updateMoves = async (source, id, moves) => {
    var userId = ""
    if(user && isAuthenticated){
      userId= user.sub.replace('|', '_')
    }

    switch (source){
      case "box":{
        var copy = box.find((obj) => obj._id == id)
        copy.moves = moves
        if(user && isAuthenticated){
          axios.patch(`${backend_url}/${userId}/box/update/${id}`, copy)
            .then(res =>{
              setBox(box.map(
                (obj) => obj.id === id //For every obj, if obj._id equals id
                ? {...obj, moves: res.moves }  //Update obj nickname
                : obj) //Else, leave obj as is
                )
            })
        }
        else{
          const newBox = box.map(
            (obj) => obj.id === id //For every obj, if obj._id equals id
            ? {...obj, moves: moves }  //Update obj nickname
            : obj) //Else, leave obj as is
          writeToCache("guest_box", newBox)
          setBox(newBox)
        }
        break
      }

      case "team":{
        var copy = team.find((obj) => obj._id == id)
        copy.moves = moves

        if(user && isAuthenticated){
          axios.patch(`${backend_url}/${userId}/team/update/${id}`, copy)
            .then(res =>{
              setTeam(team.map(
                (obj) => obj.id === id //For every obj, if obj._id equals id
                ? {...obj, moves: res.moves }  //Update obj nickname
                : obj) //Else, leave obj as is
                )
            })
        }
        else{
          const newTeam = team.map(
            (obj) => obj.id === id //For every obj, if obj._id equals id
            ? {...obj, moves: moves }  //Update obj nickname
            : obj) //Else, leave obj as is
          writeToCache("guest_team", newTeam)
          setTeam(newTeam)
        }
        break
      }

      default:
        alert("Source Error in updating moves.")
    }
  }

  /*View and Inspect Functions ==============================================================================================================*/
  const changeViewToTeams = () => {
    updateScrollState()
    setTeamBerriesToggle("teamView")
  }

  const changeViewToPokemonCatalog = () => {
    updateScrollState()
    setTeamBerriesToggle("pokemonCatalogView")
  }

  const changeViewToItemCatalog = () => {
    updateScrollState()
    setTeamBerriesToggle("itemCatalogView")
  }

  const updateScrollState = () => {
    var el = ""
    switch (teamBerriesToggle) {
      case "teamView":
          el = document.getElementById("TeamScroll")
          setTeamScrollState(el.scrollTop)
        break

      case "pokemonCatalogView":
        el = document.getElementById("PCScroll")
        setPCScrollState(el.scrollTop)
        break

      case "itemCatalogView":
        el = document.getElementById("ItemScroll")
        setItemScrollState(el.scrollTop)
        break
    }
  }

  const inspectPokemonCatalog =  (id) => {
    const data = pokemonCatalog.find((obj) => obj.id == id)
    updateScrollState()
    fetchInspectDataAPI(data.name, "pokemon")
    setInspectData(data)
    setInspectView("inspectPokemonCatalog")
    setActive(`pokemonCatalog ${id}`)
  }

  const inspectItemCatalog =  (name) => {
    const data = itemCatalog.find((obj) => obj.name == name)
    updateScrollState()
    fetchInspectDataAPI(data.name, "item")
    setInspectData(data)
    setInspectView("inspectItemCatalog")
    setActive(`itemCatalog ${name}`)
  }


  const fetchInspectDataAPI = (name, type) => {
    
    if(type == "pokemon"){

      const cached = readFromCache(`https://pokeapi.co/api/v2/pokemon/${name}`)
      if(cached){
        setInspectDataAPI(cached)
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
            move_object.url = `https://pokeapi.co/api/v2/move/${move.move.name}`
            return move_object
          })

          writeToCache(`https://pokeapi.co/api/v2/pokemon/${name}`, pokemon)
          setInspectDataAPI(pokemon)
        })
      }
    }
    else if (type == "item"){

      const cached = readFromCache(`https://pokeapi.co/api/v2/item/${name}`)
      if(cached){
        setInspectDataAPI(cached)
      }
      else{
        axios.get(`https://pokeapi.co/api/v2/item/${name}`)
        .then(res => {
          var item = {}
          item.stats = null //Preserving format
          item.types = 0;
          item.description = res.data.effect_entries[0].effect
          writeToCache(`https://pokeapi.co/api/v2/item/${name}`, item)
          setInspectDataAPI(item)
        })
      }
    }
    else{
      console.log("Error in retrieving API data: Invalid Type")
      console.log(`${name} : ${type}`)
    }
  }

  const inspectBox = (id) => {
    const data = box.find(obj => obj._id == id)
    updateScrollState()
    setInspectData(data)
    fetchInspectDataAPI(data.name, data.type)
    setInspectView("inspectBox")
    setActive(`box ${id}`)
  }

  const inspectTeam = (id) => {
    const data = team.find(obj => obj._id == id)
    updateScrollState()
    setInspectData(data)
    fetchInspectDataAPI(data.name, data.type)
    setInspectView("inspectTeam")
    setActive(`team ${id}`)
  }

const showAnalysis = () => {
    setAnalysis(true)
}

const closeAnalysis = () => {
    setAnalysis(false)
}

const showHelp = () => {
  setHelp(true)
}

const closeHelp = () => {
  setHelp(false)
}

/*Mouse Events ==============================================================================================================*/
  const onDragStart = (ev, id, source) => {
    ev.dataTransfer.setData("id", id)
    ev.dataTransfer.setData("source", source)
    if(source == "box"){
      inspectBox(id)
    }
    else if(source == "team"){
      inspectTeam(id)
    }
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
      if(source == "pokemonCatalog"){
        inspectPokemonCatalog(id)
      }
      else if(source == "itemCatalog"){
        inspectItemCatalog(id)
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
        delete copy.id //Id gets rewritten when moving between containers
    }

    //Does object formatting if source is pokemonCatalog.
    if(source == "pokemonCatalog"){
      obj = pokemonCatalog.find((pokemon) => pokemon.id == id)
      copy = JSON.parse(JSON.stringify(obj))
      copy.type = "pokemon"
      copy.nickname = ""
      delete copy.id
    }

    //Does object formatting if source is itemCatalog.
    if(source == "itemCatalog"){
      obj = itemCatalog.find((item) => item.name == id)
      copy = JSON.parse(JSON.stringify(obj))
      copy.type = "item"
      copy.nickname = ""
    }


    //Destination decision
    switch(dest){

      case "box": {
        console.log(`Adding obj ${id} from ${source} to box.`)
        if(source == "team"){
          moveTo(id, source, dest)
        }
        else{
          addObjToBox(copy)
        }
        return
      }

      case "team":{
        console.log(`Adding obj ${id} from ${source} to team.`)
        if(source == "box"){
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
              <MenuBar isAuthenticated={isAuthenticated} isLoading={isLoading} user={user} teamView={changeViewToTeams} pokemonCatalogView={changeViewToPokemonCatalog} itemCatalogView={changeViewToItemCatalog} analysis={showAnalysis} help={showHelp} />
            </div>
            <Container fluid className="topSideView">
              <Row noGutters="true">
                <Col xs={4} md={6}>
                  {(teamBerriesToggle == "pokemonCatalogView") && <h4 className="pokemonCatalog-header">Pokemon</h4>}
                  {(teamBerriesToggle == "itemCatalogView") && <h4 className="itemCatalog-header">Items</h4>}
                  {(teamBerriesToggle == "teamView") && <h4 className="team-header">Team</h4>}
                </Col>
                <Col xs={8} md={6}>
                  <h4 className="pokemonCatalog-header">Inspector</h4>
                </Col>
              </Row>
              <Row noGutters="true">
                <Col xs={4} md={6}> {/*Natively one column is 25% while the other is 75%. On desktop, it switches to 50-50 */}
                  <div className="leftSideView">
                    {(teamBerriesToggle == "teamView") && <Team active={active} scrollState={teamScrollState} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} inspect={inspectTeam} team={team} />}
                    {(teamBerriesToggle == "pokemonCatalogView") && <PokemonCatalog active={active} scrollState={pCScrollState} onDragStart={onDragStart} inspect={inspectPokemonCatalog} pokemons={pokemonCatalog} />} 
                    {(teamBerriesToggle == "itemCatalogView") && <ItemCatalog active={active} scrollState={itemScrollState} onDragStart={onDragStart} inspect={inspectItemCatalog} items={itemCatalog} />} 
                  </div> 
                </Col>
                <Col xs={8} md={6}>
                    <Inspector onDragOver={onDragOver} onDrop={onDrop} view={inspectView} object={inspectData} apiData={inspectDataAPI} updatePokemonMoves={updateMoves} updateNickname={updateNickname} AddObjectToBox={addObjToBox} AddObjectToTeam={addObjToTeam} removeObj={removeObj} moveTo={moveTo} />
                </Col>
              </Row>
            </Container>
            <Container fluid>
              <h4 className="box-header">Box</h4>
              <Box active={active} scrollState={boxScrollState} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} inspect={inspectBox} box={box} />
            </Container> 
            <Modal
              show={analysis}
              onHide={closeAnalysis}
              centered
            >
              <Modal.Header>
                  <h2>Analysis</h2>
                  <Button onClick={() => closeAnalysis()} variant="primary"> Close </Button>
              </Modal.Header>
              <Modal.Body>
                <Analysis team={team} />
              </Modal.Body>
              <Modal.Footer></Modal.Footer>
            </Modal>
            <Modal
              show={help}
              onHide={closeHelp}
              centered
            >
              <Modal.Header>
                  <h2>Tips for using Team Builder</h2>
                  <Button onClick={() => closeHelp()} variant="primary"> Close </Button>
              </Modal.Header>
              <Modal.Body>
                <Help />
              </Modal.Body>
              <Modal.Footer></Modal.Footer>
            </Modal>
          </>
          )} />
        <Route path='/PostLogin' exact render={(props) => (
          <PostLogin user={user} isLoading={isLoading} isAuthenticated={isAuthenticated} backend_url={backend_url} updateBox={updateBox} />
        )}/>
      </Router>
      
    </div>
  );
}

export default App;
