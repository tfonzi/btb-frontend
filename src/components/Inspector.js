import 'bootstrap/dist/css/bootstrap.min.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'

import axios from 'axios';

import './components.css'

import Stats from './Stats'
import Moves from './Moves'



import {useState} from 'react'
import PokemonCatalog from './PokemonCatalog'

const Inspector = ({view, object, apiData, onDragOver, onDrop, updatePokemonMoves, updateNickname, AddObjectToBox, AddObjectToTeam, removeObj, moveTo}) => {
    
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
            <div className="rightSideView"
                onDragOver={(e) => onDragOver(e)} 
                onDrop={(e) => onDrop(e, e.dataTransfer.getData("source"),
                                        e.dataTransfer.getData("id"),
                                        "inspector")}
            >
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
                    <div className="rightSideView"
                        onDragOver={(e) => onDragOver(e, "inspector")} 
                        onDrop={(e) => onDrop(e, e.dataTransfer.getData("source"),
                                                e.dataTransfer.getData("id"),
                                                "inspector")}
                    >
                    
                        <Row className="inspector-rows">
                            <Col className="inspector-cols">
                                <p className="p">{object.name}</p>
                                <Image draggable="false" src={object.image}/>
                                {(apiData.types.length == 2) && <p className="inspector-type">{apiData.types[0]} / {apiData.types[1]}</p>}
                                {(apiData.types.length == 1) && <p className="inspector-type">{apiData.types}</p>}
                            </Col>
                            <Col className="inspector-cols">
                                <div className="inspector-buttons">
                                    <Button className="inspector-button" variant="success" onClick={() => sendObject("team")} >Add to Team</Button>
                                    <Button className="inspector-button" onClick={() => sendObject("box")} >Add to Box</Button>
                                </div>
                            </Col>
                        </Row>
                        <Row className="inspector-rows">
                            {(apiData.stats) && <Stats stats={apiData.stats} />}
                        </Row>
                    </div>
                )

            case "inspectItemCatalog": //ItemCatalog Inspect 
            
                return(
                    <div className="rightSideView"
                        onDragOver={(e) => onDragOver(e, "inspector")} 
                        onDrop={(e) => onDrop(e, e.dataTransfer.getData("source"),
                                                e.dataTransfer.getData("id"),
                                                "inspector")}
                    >
                    
                        <Row className="inspector-rows">
                            <Col className="inspector-cols">
                                <p className="p">{object.name}</p>
                                <Image draggable="false" src={object.image}/>
                            </Col>
                            <Col className="inspector-cols">
                                <Button className="inspector-buttons" onClick={() => sendObject("box")} >Add to Box</Button>
                            </Col>
                        </Row>
                        <p className="p">{apiData.description}</p>
                        
                    </div>
                )

                
            case "inspectBox": //Box Inspect 
                
                if(object.type === "item"){
                    return(
                        <div className="rightSideView"
                            onDragOver={(e) => onDragOver(e, "inspector")} 
                            onDrop={(e) => onDrop(e, e.dataTransfer.getData("source"),
                                                    e.dataTransfer.getData("id"),
                                                    "inspector")}
                        >
                            
                            <p className="p">{object.name}</p>
                            <Image fluid draggable="false" src={object.image}/>
                            <p>{apiData.description}</p>
                            <Button className="inspector-button" variant="danger" onClick={() => removeObj(object._id, "box")}>Remove from box</Button>
                                
                        </div>
                    )
                }
                else if (object.type === "pokemon"){
                    
                    return(
                        <div className="rightSideView"
                            onDragOver={(e) => onDragOver(e, "inspector")} 
                            onDrop={(e) => onDrop(e, e.dataTransfer.getData("source"),
                                                    e.dataTransfer.getData("id"),
                                                    "inspector")}
                        >
                            <Row className="inspector-rows">
                                <Col className="inspector-cols">
                                    <p className="p">{object.name}</p>
                                    {(object.nickname) && <p className="p">"{object.nickname}"</p>}
                                    <Image fluid draggable="false" src={object.image}/>
                                    {(apiData.types.length == 2) && <p className="inspector-type">{apiData.types[0]} / {apiData.types[1]}</p>}
                                    {(apiData.types.length == 1) && <p className="inspector-type">{apiData.types}</p>}
                                </Col>
                                <Col className="inspector-cols">
                                    <div className="inspector-buttons">
                                        <Button className="inspector-button" variant="danger" onClick={() => removeObj(object._id, "box")}> Remove from box</Button>
                                        <Button className="inspector-button" variant="success" onClick={() => moveTo(object._id, "box", "team")}> Move to Team</Button>
                                    </div>
                                </Col>
                            </Row>
                            <div className="inspector-nickname">
                                <Button className="inspector-nickname-button" variant="warning" onClick={sendNickname} >Name!</Button>
                                <input className="inspector-nickname-field" type="text" placeholder="Enter nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                            </div>
                            <div>
                                {(apiData.stats) && <Stats stats={apiData.stats} />}  
                                {(apiData.moves) && <Moves key={object._id} pokemon={object} source="box" updatePokemonMoves={updatePokemonMoves} movesAPI={apiData.moves} />}    
                            </div>
                        </div>
                    )
                }
                else{
                    return(<p>Error in displaying box object of type {object.type}</p>)
                }
            
            case "inspectTeam": //Team Inspect 
                return(
                    <div className="rightSideView"
                        onDragOver={(e) => onDragOver(e, "inspector")} 
                        onDrop={(e) => onDrop(e, e.dataTransfer.getData("source"),
                                                e.dataTransfer.getData("id"),
                                                "inspector")}
                    >
                        
                        <Row className="inspector-rows">
                            <Col className="inspector-cols">
                                <p className="p">{object.name}</p>
                                {(object.nickname) && <p className="p">"{object.nickname}"</p>}
                                <Image fluid draggable="false" src={object.image}/>
                                {(apiData.types.length == 2) && <p className="inspector-type">{apiData.types[0]} / {apiData.types[1]}</p>}
                                {(apiData.types.length == 1) && <p className="inspector-type">{apiData.types}</p>}
                            </Col>
                            <Col className="inspector-cols">
                                <div className="inspector-buttons">
                                    <Button className="inspector-button" variant="danger" onClick={() => removeObj(object._id, "team")} >Remove from team</Button>
                                    <Button className="inspector-button" onClick={() => moveTo(object._id, "team", "box")} >Move to Box</Button>
                                </div>
                            </Col>
                        </Row>
                        <div className="inspector-nickname">
                            <Button className="inspector-nickname-button" variant="warning" onClick={sendNickname} >Name!</Button>
                            <input className="inspector-nickname-field" type="text" placeholder="Enter nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                        </div> 
                        <div>
                            {(apiData.stats) && <Stats stats={apiData.stats} />}  
                            {(apiData.moves) && <Moves key={object._id} pokemon={object} source="team" updatePokemonMoves={updatePokemonMoves} movesAPI={apiData.moves} />}    
                        </div>
                    </div>
                )
                
            default:
                return(
                    <div className="rightSideView"
                        onDragOver={(e) => onDragOver(e)} 
                        onDrop={(e) => onDrop(e, e.dataTransfer.getData("source"),
                                                e.dataTransfer.getData("id"),
                                                "inspector")}
                    >
                    </div>
                )
        }
    }
}

export default Inspector
