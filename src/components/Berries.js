import Berry from './Berry'

import {useEffect} from 'react'


import './components.css'

const Berries = ({berries, inspect, onDragStart, scrollState, active}) => {
    
    useEffect(() => {
        var el = document.getElementById("BerryScroll")
        if(el){
            el.scrollTop = scrollState
        }
    })
    
    return (
        <>
            <p className="berryCatalog-header">Berry List</p>
            <div id="BerryScroll" className ="berryCatalog-flex">
                {berries.map((berry) => (
                <div key={berry._id}>
                    {(active == `berryCatalog ${berry._id}`) && <div className="active-berryCatalog-object" key={berry._id}> <Berry key={berry._id} onDragStart={onDragStart} inspect={inspect} berry={berry} /> </div>}
                    {(active != `berryCatalog ${berry._id}`) && <div className="berryCatalog-object" key={berry._id}> <Berry key={berry._id} onDragStart={onDragStart} inspect={inspect} berry={berry} /> </div>}
                </div>
                ))} 
            </div>
        </>
    )
}

export default Berries
