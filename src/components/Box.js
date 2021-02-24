import BoxObj from './BoxObj'

import './components.css'

const Box = ({box, inspect, onDragStart, onDragOver, onDrop}) => {
    
    return (
        <div className="box" onDragOver={(e) => onDragOver(e)} 
                onDrop={(e) => onDrop(e, e.dataTransfer.getData("source"), 
                                        e.dataTransfer.getData("id"), 
                                        'box')}
        >
            <h3 className="box-header">Box</h3>
            <div className="box-flex">
                {box.map((obj) => (
                <div className="box-object" key={obj._id}>
                    <BoxObj key={obj._id} onDragStart={onDragStart} inspect={inspect} obj={obj} />
                </div>
                ))}
            </div>
        </div>
    )
}

export default Box
