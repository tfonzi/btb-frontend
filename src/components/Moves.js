import {useState, useEffect} from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'


import './components.css'
import './types.css'

import axios from 'axios'
import { readFromCache, writeToCache } from './../cache.js'



const Moves = ({pokemon, source, movesAPI, updatePokemonMoves}) => {
    
    const [availableForMove_1, setAvailableForMove_1] = useState([{name: "", url: ""}, ...movesAPI])
    const [availableForMove_2, setAvailableForMove_2] = useState([{name: "", url: ""}, ...movesAPI])
    const [availableForMove_3, setAvailableForMove_3] = useState([{name: "", url: ""}, ...movesAPI])
    const [availableForMove_4, setAvailableForMove_4] = useState([{name: "", url: ""}, ...movesAPI])
    const [select_1, setSelect_1] = useState(pokemon.moves[0])
    const [select_2, setSelect_2] = useState(pokemon.moves[1])
    const [select_3, setSelect_3] = useState(pokemon.moves[2])
    const [select_4, setSelect_4] = useState(pokemon.moves[3])
    const [moveData, setMoveData] = useState("")
    const [width, setWidth] = useState(window.innerWidth)
    const [mobileModal, setMobileModal] = useState(false)

    useEffect(() => {

        const initAvaliableMoves = () => { //similar to updateAvailableMoves but specialize to be used in useEffect

            var newMovesForMove_1 = Array.from(movesAPI)
            var newMovesForMove_2 = Array.from(movesAPI)
            var newMovesForMove_3 = Array.from(movesAPI)
            var newMovesForMove_4 = Array.from(movesAPI)
            //Added blank space for no selection
            newMovesForMove_1.unshift({name: "", url: ""})
            newMovesForMove_2.unshift({name: "", url: ""})
            newMovesForMove_3.unshift({name: "", url: ""})
            newMovesForMove_4.unshift({name: "", url: ""})
    
            let move_1 = pokemon.moves[0]
            let move_2 = pokemon.moves[1]
            let move_3 = pokemon.moves[2]
            let move_4 = pokemon.moves[3]
            
            if(move_1){
                newMovesForMove_2 = newMovesForMove_2.filter(move => move.name != move_1)
                newMovesForMove_3 = newMovesForMove_3.filter(move => move.name != move_1)
                newMovesForMove_4 = newMovesForMove_4.filter(move => move.name != move_1)
            }
            if(move_2){
                newMovesForMove_1 = newMovesForMove_1.filter(move => move.name != move_2)
                newMovesForMove_3 = newMovesForMove_3.filter(move => move.name != move_2)
                newMovesForMove_4 = newMovesForMove_4.filter(move => move.name != move_2)
            }
            if(move_3){
                newMovesForMove_1 = newMovesForMove_1.filter(move => move.name != move_3)
                newMovesForMove_2 = newMovesForMove_2.filter(move => move.name != move_3)
                newMovesForMove_4 = newMovesForMove_4.filter(move => move.name != move_3)
            }
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

        initAvaliableMoves()

        //Code for getting screen width
        const resizeWidth = () => {
            setWidth(window.innerWidth)
        }
        window.addEventListener('resize', resizeWidth)
        return _ => {
            window.removeEventListener('resize', resizeWidth)
        }
        
    }, [movesAPI])

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
        if(name == ""){
            setMoveData("")
            return
        }
        
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
            setSelect_1(move_1)
            moves.push(move_1)
        }
        else{
            setSelect_1("")
            moves.push("")
        }
        let move_2 = document.getElementById("move_2").value
        if(move_2){
            setSelect_2(move_2)
            moves.push(move_2)
        }
        else{
            setSelect_2("")
            moves.push("")
        }
        let move_3 = document.getElementById("move_3").value
        if(move_3){
            setSelect_3(move_3)
            moves.push(move_3)
        }
        else{
            setSelect_3("")
            moves.push("")
        }
        let move_4 = document.getElementById("move_4").value
        if(move_4){
            setSelect_4(move_4)
            moves.push(move_4)
        }
        else{
            setSelect_4("")
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

    if(width <= 448){  //Mobile==============================================================================================================
        return (
            <div className="inspector-moves">
                <Row>
                    <Col>
                        <Row>
                            <Col xs={8}>
                            <select className="inspector-move-select" value={select_1} onBlur={() => resetFocus()} onChange={() => updateMoves("move_1")} id="move_1">
                                {availableForMove_1.map(move => (
                                    <option key={`move_1_${move.name}`} value={move.name}>{move.name}</option>
                                ))}
                            </select>
                            </Col>
                            <Col xs={4}>
                            {(pokemon.moves[0]) && <Button  className="inspector-move-button" onClick={() => mobileMoveButtonPress("move_1")}>Info</Button>}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={8}>
                            <select className="inspector-move-select" value={select_2} onBlur={() => resetFocus()} onChange={() => updateMoves("move_2")} id="move_2">
                                {availableForMove_2.map(move => (
                                    <option key={`move_2_${move.name}`} value={move.name}>{move.name}</option>
                                ))}
                            </select>
                            </Col>
                            <Col xs={4}>
                                {(pokemon.moves[1]) && <Button className="inspector-move-button" onClick={() => mobileMoveButtonPress("move_2")}>Info</Button>}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={8}>
                            <select className="inspector-move-select" value={select_3} onBlur={() => resetFocus()} onChange={() => updateMoves("move_3")} id="move_3">
                                {availableForMove_3.map(move => (
                                    <option key={`move_3_${move.name}`} value={move.name}>{move.name}</option>
                                ))}
                            </select>
                            </Col>
                            <Col xs={4}>
                                {(pokemon.moves[2]) && <Button className="inspector-move-button" onClick={() => mobileMoveButtonPress("move_3")}>Info</Button>}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={8}>
                            <select className="inspector-move-select" value={select_4} onBlur={() => resetFocus()} onChange={() => updateMoves("move_4")} id="move_4">
                                {availableForMove_4.map(move => (
                                    <option key={`move_4_${move.name}`} value={move.name}>{move.name}</option>
                                ))}
                            </select>
                            </Col>
                            <Col xs={4}>
                            {(pokemon.moves[3]) && <Button className="inspector-move-button" onClick={() => mobileMoveButtonPress("move_4")}>Info</Button>}
                            </Col>
                        </Row>
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
                        <Button onClick={() => closeModal()} variant="primary"> Close </Button>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="p_inspector-move-data-type">Type:</p><p className={`type-inspector-move ${moveData.type.name}`}>{moveData.type.name}</p>
                        <p className="p_inspector-move-data"><b>Damage class:</b> {moveData.damage_class.name}</p>
                        {(moveData.power) && <p className="p_inspector-move-data"><b>Power:</b> {moveData.power}</p>}
                        <p className="p_inspector-move-data"><b>PP:</b> {moveData.pp}</p>
                        {(moveData.accuracy) && <p className="p_inspector-move-data"><b>Accuracy:</b> {moveData.accuracy}</p>}
                        <p className="p_inspector-move-data"><b>Description:</b> {moveData.effect_entries[0].effect}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        
                    </Modal.Footer>
                </Modal>}
            </div>
        )
    }
    else{ //Desktop==============================================================================================================

        return (
            <div className="inspector-moves">
                <Row>
                    <Col md={4}>
                        <Row>
                            <Col>
                            <select className="inspector-move-select" value={select_1} onChange={() => updateMoves("move_1")} id="move_1">
                                {availableForMove_1.map(move => (
                                    <option key={`move_1_${move.name}`} value={move.name}>{move.name}</option>
                                ))}
                            </select>
                            </Col>
                            <Col>
                            {(pokemon.moves[0]) && <Button  className="inspector-move-button" onClick={() => updateMoveData("move_1")}>Info</Button>}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                            <select className="inspector-move-select" value={select_2} onChange={() => updateMoves("move_2")} id="move_2">
                                {availableForMove_2.map(move => (
                                    <option key={`move_2_${move.name}`} value={move.name}>{move.name}</option>
                                ))}
                            </select>
                            </Col>
                            <Col>
                                {(pokemon.moves[1]) && <Button className="inspector-move-button" onClick={() => updateMoveData("move_2")}>Info</Button>}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                            <select className="inspector-move-select" value={select_3} onChange={() => updateMoves("move_3")} id="move_3">
                                {availableForMove_3.map(move => (
                                    <option key={`move_3_${move.name}`} value={move.name}>{move.name}</option>
                                ))}
                            </select>
                            </Col>
                            <Col>
                                {(pokemon.moves[2]) && <Button className="inspector-move-button" onClick={() => updateMoveData("move_3")}>Info</Button>}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                            <select className="inspector-move-select" value={select_4} onChange={() => updateMoves("move_4")} id="move_4">
                                {availableForMove_4.map(move => (
                                    <option key={`move_4_${move.name}`} value={move.name}>{move.name}</option>
                                ))}
                            </select>
                            </Col>
                            <Col>
                            {(pokemon.moves[3]) && <Button className="inspector-move-button" onClick={() => updateMoveData("move_4")}>Info</Button>}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={8}>
                        {(moveData) && <div className="inspector-move-data">
                            <p className="p_inspector-move-data"><b>Name:</b> {moveData.name}</p>
                            <p className="p_inspector-move-data-type">Type:</p><p className={`type-inspector-move ${moveData.type.name}`}>{moveData.type.name}</p>
                            <p className="p_inspector-move-data"><b>Damage class:</b> {moveData.damage_class.name}</p>
                            {(moveData.power) && <p className="p_inspector-move-data"><b>Power:</b> {moveData.power}</p>}
                            <p className="p_inspector-move-data"><b>PP:</b> {moveData.pp}</p>
                            {(moveData.accuracy) && <p className="p_inspector-move-data"><b>Accuracy:</b> {moveData.accuracy}</p>}
                            <p className="p_inspector-move-data-nocap"><b>Description:</b> {moveData.effect_entries[0].effect}</p>
                        </div>}
                    </Col>
                </Row>
            <div className="scroll-spacer"> </div>
            
            
            </div>
        )
    }
}

export default Moves
