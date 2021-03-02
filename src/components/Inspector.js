import 'bootstrap/dist/css/bootstrap.min.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'

import axios from 'axios';

import './components.css'

import Stats from './Stats'


import {useState} from 'react'
import PokemonCatalog from './PokemonCatalog'

const Inspector = ({view, object, apiData, onDragOver, onDrop, updateNickname, AddObjectToBox, AddObjectToTeam, removeObj, moveTo}) => {
    
    const [nickname, setNickname] = useState("")

    const sendNickname = () =>{
        if(nickname){
            
            if(view == "inspectBox")
                updateNickname("box", object._id, nickname)

            if(view == "inspectTeam")
                updateNickname("team", object._id, nickname)
            
            object.nickname = nickname
            setNickname("")
        }
        else{ //delete nickname
            if(view == "inspectBox")
                updateNickname("box", object._id, "")

            if(view == "inspectTeam")
                updateNickname("team", object._id, "")
            
            object.nickname = ""
            setNickname("")
        }
    }

    const sendObject = (source) =>{

        var copy = JSON.parse(JSON.stringify(object)) //creates deep copy of original obj
        copy.type = ""
        if(view == "inspectBerryCatalog"){
            copy.type = "berry"
        }
        else if(view == "inspectPokemonCatalog"){
            copy.type = "pokemon"
        }
        else if(view == "inspectItemCatalog"){
            copy.type = "item"
        }
        copy.nickname = ""
        delete copy._id
        if(source == "box"){
            AddObjectToBox(copy)
        }

        if(source == "team"){
            AddObjectToTeam(copy)
        }
    }

    if(!object){
        return(
            <div
                onDragOver={(e) => onDragOver(e)} 
                onDrop={(e) => onDrop(e, e.dataTransfer.getData("source"),
                                        e.dataTransfer.getData("id"),
                                        "inspector")}
            >
                <div height="60%">
                    <p>Click to Inspect!</p>
                </div>
            </div>
        )
    }
    else{
        switch(view){

            case "inspectBerryCatalog": //BerryCatalog Inspect
                return(
                        <div
                            onDragOver={(e) => onDragOver(e, "inspector")} 
                            onDrop={(e) => onDrop(e, e.dataTransfer.getData("source"),
                                                    e.dataTransfer.getData("id"),
                                                    "inspector")}
                        >
                            <h4>{object.name}</h4>
                            <Image fluid draggable="false" src={object.image} />
                            <h5>{object.description}</h5>
                            <Row>
                                <Col>
                                    <Button onClick={() => sendObject("box")} >Add to Box</Button>
                                </Col>
                            </Row>
                        </div>
                    )

            case "inspectPokemonCatalog": //PokemonCatalog Inspect 
            
                return(
                    <div
                        onDragOver={(e) => onDragOver(e, "inspector")} 
                        onDrop={(e) => onDrop(e, e.dataTransfer.getData("source"),
                                                e.dataTransfer.getData("id"),
                                                "inspector")}
                    >
                    
                        <Row>
                            <Col>
                                <p className="p">{object.name}</p>
                                <Image draggable="false" src={object.image}/>
                                {(apiData.types.length == 2) && <p>{apiData.types[0]} / {apiData.types[1]}</p>}
                                {(apiData.types.length == 1) && <p>{apiData.types}</p>}
                                <Stats stats={apiData.stats} />
                            </Col>
                            <Col>
                                <Button onClick={() => sendObject("team")} >Add to Team</Button>
                                <Button onClick={() => sendObject("box")} >Add to Box</Button>
                            </Col>
                        </Row>
                        
                    </div>
                )

            case "inspectItemCatalog": //ItemCatalog Inspect 
            
                return(
                    <div
                        onDragOver={(e) => onDragOver(e, "inspector")} 
                        onDrop={(e) => onDrop(e, e.dataTransfer.getData("source"),
                                                e.dataTransfer.getData("id"),
                                                "inspector")}
                    >
                    
                        <Row>
                            <Col>
                                <p className="p">{object.name}</p>
                                <Image draggable="false" src={object.image}/>
                                <p className="p">{apiData.description}</p>
                            </Col>
                            <Col>
                                <Button onClick={() => sendObject("box")} >Add to Box</Button>
                            </Col>
                        </Row>
                        
                    </div>
                )

                
            case "inspectBox": //Box Inspect 
                
                if(object.type === "item"){
                    return(
                        <div
                            onDragOver={(e) => onDragOver(e, "inspector")} 
                            onDrop={(e) => onDrop(e, e.dataTransfer.getData("source"),
                                                    e.dataTransfer.getData("id"),
                                                    "inspector")}
                        >
                            <>
                                <h4>{object.name}</h4>
                                <Image fluid draggable="false" src={object.image}/>
                                <h5>{apiData.description}</h5>
                                <Row>
                                    <Col>
                                        <Button variant="danger" onClick={() => removeObj(object._id, "box")}>Remove from box</Button>
                                    </Col>
                                </Row>
                            </>
                        </div>
                    )
                }
                else if (object.type === "pokemon"){
                    
                    return(
                        <div
                            onDragOver={(e) => onDragOver(e, "inspector")} 
                            onDrop={(e) => onDrop(e, e.dataTransfer.getData("source"),
                                                    e.dataTransfer.getData("id"),
                                                    "inspector")}
                        >
                            <>
                                <h4>{object.name}</h4>
                                {(object.nickname) && <h5>"{object.nickname}"</h5>}
                                <Image fluid draggable="false" src={object.image}/>
                                {(apiData.types.length == 2) && <p>{apiData.types[0]} / {apiData.types[1]}</p>}
                                {(apiData.types.length == 1) && <p>{apiData.types}</p>}
                                <Stats stats={apiData.stats} />
                                <Row>
                                    <Col>
                                        <Button onClick={sendNickname} >Change Nickname</Button>
                                        <input type="text" placeholder="Enter nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                                    </Col>
                                    <Col>
                                        <Button variant="danger" onClick={() => removeObj(object._id, "box")}> Remove from box</Button>
                                        <Button variant="success" onClick={() => moveTo(object._id, "box", "team")}> Move to Team</Button>
                                    </Col>
                                </Row>
                            </>
                        </div>
                    )
                }
                else{
                    return(<p>Error in displaying box object of type {object.type}</p>)
                }
            
            case "inspectTeam": //Team Inspect 
                return(
                    <div
                        onDragOver={(e) => onDragOver(e, "inspector")} 
                        onDrop={(e) => onDrop(e, e.dataTransfer.getData("source"),
                                                e.dataTransfer.getData("id"),
                                                "inspector")}
                    >
                        <>
                            <h4>{object.name}</h4>
                            {(object.nickname) && <h5>"{object.nickname}"</h5>}
                            <Image fluid draggable="false" src={object.image}/>
                            {(apiData.types.length == 2) && <p>{apiData.types[0]} / {apiData.types[1]}</p>}
                            {(apiData.types.length == 1) && <p>{apiData.types}</p>}
                            <Stats stats={apiData.stats} />
                            <Row>
                                <Col>
                                    <Button onClick={sendNickname} >Change Nickname</Button>
                                    <input type="text" placeholder="Enter nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                                </Col>
                                <Col>
                                    <Button variant="danger" onClick={() => removeObj(object._id, "team")} >Remove from team</Button>
                                    <Button variant="success" onClick={() => moveTo(object._id, "team", "box")} >Move to Box</Button>
                                </Col>
                            </Row>
                        </>
                    </div>
                )
                
            default:
                return(
                    <div className="inspector"
                        onDragOver={(e) => onDragOver(e)} 
                        onDrop={(e) => onDrop(e, e.dataTransfer.getData("source"),
                                                e.dataTransfer.getData("id"),
                                                "inspector")}
                    >
                        <div height="500px">
                            <h1>Click to Inspect!</h1>
                        </div>
                    </div>
                )
        }
    }
}

export default Inspector
