import BoxObj from './BoxObj'

import {useEffect} from 'react'


import './components.css'

const Box = ({box, inspect, onDragStart, onDragOver, onDrop, scrollState, active}) => {
    
    useEffect(() => {
        var el = document.getElementById("BoxScroll")
        if(el){
            el.scrollTop = scrollState
        }
    })

    return (
        <div className="box" onDragOver={(e) => onDragOver(e)} 
                onDrop={(e) => onDrop(e, e.dataTransfer.getData("source"), 
                                        e.dataTransfer.getData("id"), 
                                        'box')}
        >
            <h3 className="box-header">Box</h3>
            <div id="BoxScroll" className="box-flex">
                {box.map((obj) => (
                    <div key={obj._id}>
                        {(active == `box ${obj._id}`) && <div className="active-box-object" key={obj._id}> 
                            <BoxObj key={obj._id} onDragStart={onDragStart} inspect={inspect} obj={obj} />
                        </div>}

                        {(active != `box ${obj._id}`) && <div className="box-object" key={obj._id}> 
                            <BoxObj key={obj._id} onDragStart={onDragStart} inspect={inspect} obj={obj} />
                        </div>}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Box
