import Image from 'react-bootstrap/Image'

import './components.css'

const Berry = ({berry, inspect, onDragStart, scrollState}) => {
    
    return (
        <div onDragStart={(e) => onDragStart(e, berry._id, 'berryCatalog')} draggable onClick={() => inspect(berry._id)}>
            <Image fluid draggable="false" src={berry.image} />
            <p className="p">{berry.name}</p>
        </div>
    )
}

export default Berry
