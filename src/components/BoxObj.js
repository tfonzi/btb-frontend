import Image from 'react-bootstrap/Image'

import './components.css'

const BoxObj = ({obj, inspect, onDragStart}) => {
    
    return (
        <div onDragStart={(e) => onDragStart(e, obj._id, 'box')} draggable onClick={() => inspect(obj._id)}>
            <Image fluid draggable="false" src={obj.image}/>
            <p className="p">{obj.name}</p>
            {(obj.nickname) && <p className="p">"{obj.nickname}"</p>}
        </div>
    )
}

export default BoxObj
