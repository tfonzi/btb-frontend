import Image from 'react-bootstrap/Image'


const TeamMember = ({obj, inspect, onDragStart}) => {
    return (
        <div onDragStart={(e) => onDragStart(e, obj._id, 'team')} draggable onClick={() => inspect(obj._id)}>
            <Image className="team-image" draggable="false" src={obj.image}/>
            <p className="p-team">{obj.name}</p>
            {(obj.nickname) && <p className="p-team">"{obj.nickname}"</p>}
        </div>
    )
}

export default TeamMember
