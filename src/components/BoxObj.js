import Image from 'react-bootstrap/Image'

import './components.css'

const BoxObj = ({obj, inspect, onDragStart}) => {
    
    return (
        <div onDragStart={(e) => onDragStart(e, obj._id, 'box')} draggable onClick={() => inspect(obj._id)}>
            <Image className="box-image" draggable="false" src={obj.image}/>
            <p className="p-box">{obj.name}</p>
            {(obj.nickname) && <p className="p-box-nickname">"{obj.nickname}"</p>}
        </div>
    )
}

export default BoxObj
