import 'bootstrap/dist/css/bootstrap.min.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'

import './components.css'




import {useState} from 'react'

const Inspector = ({view, object, onDragOver, onDrop, updateNickname, AddObjectToBox, AddObjectToTeam, removeObj}) => {
    
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
        else{
            alert("Type in a nickname")
        }
    }

    const sendObject = (source) =>{

        var copy = JSON.parse(JSON.stringify(object)) //creates deep copy of original obj
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
                                    <Button onClick={() => sendObject("team")} >Add to Team</Button>
                                </Col>
                                <Col>
                                    <Button onClick={() => sendObject("box")} >Add to Box</Button>
                                </Col>
                            </Row>
                        </div>
                    )
            case "inspectBox": //Box Inspect 
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
                            <h5>{object.description}</h5>
                            <Row>
                                <Col>
                                    <Button onClick={sendNickname} >Change Nickname</Button>
                                    <input type="text" placeholder="Enter nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                                </Col>
                                <Col>
                                    <Button variant="danger" onClick={() => removeObj(object._id, "box")}>Remove from box</Button>
                                </Col>
                            </Row>
                        </>
                    </div>
                )

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
                            <h5>{object.description}</h5>
                            <Row>
                                <Col>
                                    <Button onClick={sendNickname} >Change Nickname</Button>
                                    <input type="text" placeholder="Enter nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                                </Col>
                                <Col>
                                    <Button variant="danger" onClick={() => removeObj(object._id, "team")} >Remove from team</Button>
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
