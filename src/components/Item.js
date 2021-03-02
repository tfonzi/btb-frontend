import Image from 'react-bootstrap/Image'

import './components.css'

const Item = ({item, inspect, onDragStart}) => {
    return (
        <div onDragStart={(e) => onDragStart(e, item.name, 'itemCatalog')} draggable onClick={() => inspect(item.name)}>
            <Image className="itemCatalog-image" draggable="false" src={item.image}/>
            <p className="itemCatalog-p">{item.name}</p>
        </div>
    )
}

export default Item