import {useState, useEffect} from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'

import './components.css'
import axios from 'axios'
import { readFromCache, writeToCache } from './../cache.js'



const Moves = ({pokemon, source, movesAPI, updatePokemonMoves}) => {
    
    const [availableForMove_1, setAvailableForMove_1] = useState([{name: "", url: ""}, ...movesAPI])
    const [availableForMove_2, setAvailableForMove_2] = useState([{name: "", url: ""}, ...movesAPI])
    const [availableForMove_3, setAvailableForMove_3] = useState([{name: "", url: ""}, ...movesAPI])
    const [availableForMove_4, setAvailableForMove_4] = useState([{name: "", url: ""}, ...movesAPI])
    const [moveData, setMoveData] = useState("")
    const [width, setWidth] = useState(window.innerWidth)
    const [mobileModal, setMobileModal] = useState(false)

    useEffect(() => {
       
        let move_1 = pokemon.moves[0]
        let move_2 = pokemon.moves[1]
        let move_3 = pokemon.moves[2]
        let move_4 = pokemon.moves[3]

        let select_1 = document.getElementById("move_1")
        let select_2 = document.getElementById("move_2")
        let select_3 = document.getElementById("move_3")
        let select_4 = document.getElementById("move_4")

        select_1.value = move_1
        select_2.value = move_2
        select_3.value = move_3
        select_4.value = move_4

        updateAvaliableMoves()


        //Code for getting screen width
        const resizeWidth = () => {
            setWidth(window.innerWidth)
        }
        window.addEventListener('resize', resizeWidth)
        return _ => {
            window.removeEventListener('resize', resizeWidth)
        }
        
    }, [])

    const resetFocus = () => {
        window.scrollTo(0, 0)
    }

    const showModal = () => {
        setMobileModal(true)
    }

    const closeModal = () => {
        setMobileModal(false)
    }


    const mobileMoveButtonPress = (move) => {
        updateMoveData(move)
        showModal()
    }

    const updateMoveData = (move) => {
        let name = document.getElementById(move).value
        let move_object = movesAPI.find( move => move.name === name)
        let url = move_object.url
        
        const cached = readFromCache(url)
        if(cached){
            setMoveData(cached)
        }
        else{
            axios.get(url)
            .then(res => {
                writeToCache(url, res.data)
                setMoveData(res.data)
            })
        }
    }


    const updateKnownMoves = () => {
        var moves = []
        let move_1 = document.getElementById("move_1").value
        if(move_1){
            moves.push(move_1)
        }
        else{
            moves.push("")
        }
        let move_2 = document.getElementById("move_2").value
        if(move_2){
            moves.push(move_2)
        }
        else{
            moves.push("")
        }
        let move_3 = document.getElementById("move_3").value
        if(move_3){
            moves.push(move_3)
        }
        else{
            moves.push("")
        }
        let move_4 = document.getElementById("move_4").value
        if(move_4){
            moves.push(move_4)
        }
        else{
            moves.push("")
        }
        pokemon.moves = moves
        updatePokemonMoves(source, pokemon._id, moves)
    }

    const updateAvaliableMoves = () => {
        //Creating deep copies from movesAPI
        var newMovesForMove_1 = Array.from(movesAPI)
        var newMovesForMove_2 = Array.from(movesAPI)
        var newMovesForMove_3 = Array.from(movesAPI)
        var newMovesForMove_4 = Array.from(movesAPI)
        //Added blank space for no selection
        newMovesForMove_1.unshift({name: "", url: ""})
        newMovesForMove_2.unshift({name: "", url: ""})
        newMovesForMove_3.unshift({name: "", url: ""})
        newMovesForMove_4.unshift({name: "", url: ""})


        let move_1 = document.getElementById("move_1").value
        if(move_1){
            newMovesForMove_2 = newMovesForMove_2.filter(move => move.name != move_1)
            newMovesForMove_3 = newMovesForMove_3.filter(move => move.name != move_1)
            newMovesForMove_4 = newMovesForMove_4.filter(move => move.name != move_1)
        }
        let move_2 = document.getElementById("move_2").value
        if(move_2){
            newMovesForMove_1 = newMovesForMove_1.filter(move => move.name != move_2)
            newMovesForMove_3 = newMovesForMove_3.filter(move => move.name != move_2)
            newMovesForMove_4 = newMovesForMove_4.filter(move => move.name != move_2)
        }
        let move_3 = document.getElementById("move_3").value
        if(move_3){
            newMovesForMove_1 = newMovesForMove_1.filter(move => move.name != move_3)
            newMovesForMove_2 = newMovesForMove_2.filter(move => move.name != move_3)
            newMovesForMove_4 = newMovesForMove_4.filter(move => move.name != move_3)
        }
        let move_4 = document.getElementById("move_4").value
        if(move_4){
            newMovesForMove_1 = newMovesForMove_1.filter(move => move.name != move_4)
            newMovesForMove_2 = newMovesForMove_2.filter(move => move.name != move_4)
            newMovesForMove_3 = newMovesForMove_3.filter(move => move.name != move_4)
        }
        setAvailableForMove_1(newMovesForMove_1)
        setAvailableForMove_2(newMovesForMove_2)
        setAvailableForMove_3(newMovesForMove_3)
        setAvailableForMove_4(newMovesForMove_4)
    }

    const updateMoves = (id) => {
        updateKnownMoves()
        updateAvaliableMoves()
        updateMoveData(id)
    }
    
    if(width <= 448){
        return (
            <div className="inspector-moves">
                <Row>
                    <Col xs={8} sm={8}>
                        <select className="inspector-move-select" onBlur={() => resetFocus()} onChange={() => updateMoves("move_1")} id="move_1">
                            {availableForMove_1.map(move => (
                                <option className="inspector-move-option" key={`move_1_${move.name}`} value={move.name}>{move.name}</option>
                            ))}
                        </select>
                        <select className="inspector-move-select" onBlur={() => resetFocus()} onChange={() => updateMoves("move_2")} id="move_2">
                            {availableForMove_2.map(move => (
                                <option className="inspector-move-option" key={`move_2_${move.name}`} value={move.name}>{move.name}</option>
                            ))}
                        </select>
                        <select className="inspector-move-select" onBlur={() => resetFocus()} onChange={() => updateMoves("move_3")} id="move_3">
                            {availableForMove_3.map(move => (
                                <option className="inspector-move-option" key={`move_3_${move.name}`} value={move.name}>{move.name}</option>
                            ))}
                        </select>
                        <select className="inspector-move-select" onBlur={() => resetFocus()} onChange={() => updateMoves("move_4")} id="move_4">
                            {availableForMove_4.map(move => (
                                <option className="inspector-move-option" key={`move_4_${move.name}`} value={move.name}>{move.name}</option>
                            ))}
                        </select>
                    </Col>
                    <Col xs={4} sm={4}>
                        <div className="inspector-move-buttons">
                            <Row>
                                {(pokemon.moves[0]) && <Button  className="inspector-move-button" onClick={() => mobileMoveButtonPress("move_1")}>Info</Button>}
                            </Row>
                            <Row>
                                {(pokemon.moves[1]) && <Button className="inspector-move-button" onClick={() => mobileMoveButtonPress("move_2")}>Info</Button>}
                            </Row>
                            <Row>
                                {(pokemon.moves[2]) && <Button className="inspector-move-button" onClick={() => mobileMoveButtonPress("move_3")}>Info</Button>}
                            </Row>
                            <Row>
                                {(pokemon.moves[3]) && <Button className="inspector-move-button" onClick={() => mobileMoveButtonPress("move_4")}>Info</Button>}
                            </Row>
                        </div>
                    </Col>
                </Row>
                <div className="scroll-spacer"> </div>

                {(moveData) && <Modal
                    show={mobileModal}
                    onHide={closeModal}
                    backdrop="static"
                    keyboard={false}
                    centered
                >
                    <Modal.Header>
                        <p className="p_inspector-move-data"><b>Name:</b> {moveData.name}</p>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="p_inspector-move-data"><b>Description:</b> {moveData.effect_entries[0].effect}</p>
                        <p className="p_inspector-move-data"><b>Type:</b> {moveData.type.name}</p>
                        <p className="p_inspector-move-data"><b>Damage class:</b> {moveData.damage_class.name}</p>
                        {(moveData.power) && <p className="p_inspector-move-data"><b>Power:</b> {moveData.power}</p>}
                        <p className="p_inspector-move-data"><b>PP:</b> {moveData.pp}</p>
                        {(moveData.accuracy) && <p className="p_inspector-move-data"><b>Accuracy:</b> {moveData.accuracy}</p>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => closeModal()} variant="primary"> Close </Button>
                    </Modal.Footer>
                </Modal>}
            </div>
        )
    }
    else{

        return (
            <div className="inspector-moves">
                <Row>
                    <Col md={3}>
                        <select className="inspector-move-select" onChange={() => updateMoves("move_1")} id="move_1">
                            {availableForMove_1.map(move => (
                                <option key={`move_1_${move.name}`} value={move.name}>{move.name}</option>
                            ))}
                        </select>
                        <select className="inspector-move-select" onChange={() => updateMoves("move_2")} id="move_2">
                            {availableForMove_2.map(move => (
                                <option key={`move_2_${move.name}`} value={move.name}>{move.name}</option>
                            ))}
                        </select>
                        <select className="inspector-move-select" onChange={() => updateMoves("move_3")} id="move_3">
                            {availableForMove_3.map(move => (
                                <option key={`move_3_${move.name}`} value={move.name}>{move.name}</option>
                            ))}
                        </select>
                        <select className="inspector-move-select" onChange={() => updateMoves("move_4")} id="move_4">
                            {availableForMove_4.map(move => (
                                <option key={`move_4_${move.name}`} value={move.name}>{move.name}</option>
                            ))}
                        </select>
                    </Col>
                    <Col md={1}>
                        <div className="inspector-move-buttons">
                            {(pokemon.moves[0]) && <Button  className="inspector-move-button" onClick={() => updateMoveData("move_1")}>Info</Button>}
                            {(pokemon.moves[1]) && <Button className="inspector-move-button" onClick={() => updateMoveData("move_2")}>Info</Button>}
                            {(pokemon.moves[2]) && <Button className="inspector-move-button" onClick={() => updateMoveData("move_3")}>Info</Button>}
                            {(pokemon.moves[3]) && <Button className="inspector-move-button" onClick={() => updateMoveData("move_4")}>Info</Button>}
                        </div>
                    </Col>
                    <Col md={8}>
                        {(moveData) && <div className="inspector-move-data">
                            <p className="p_inspector-move-data"><b>Name:</b> {moveData.name}</p>
                            <p className="p_inspector-move-data-nocap"><b>Description:</b> {moveData.effect_entries[0].effect}</p>
                            <p className="p_inspector-move-data"><b>Type:</b> {moveData.type.name}</p>
                            <p className="p_inspector-move-data"><b>Damage class:</b> {moveData.damage_class.name}</p>
                            {(moveData.power) && <p className="p_inspector-move-data"><b>Power:</b> {moveData.power}</p>}
                            <p className="p_inspector-move-data"><b>PP:</b> {moveData.pp}</p>
                            {(moveData.accuracy) && <p className="p_inspector-move-data"><b>Accuracy:</b> {moveData.accuracy}</p>}
                        </div>}
                    </Col>
                </Row>
            <div className="scroll-spacer"> </div>
            
            
            </div>
        )
    }
}

export default Moves
