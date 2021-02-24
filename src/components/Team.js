import TeamMember from './TeamMember'

import './components.css'

const Team = ({team, inspect, onDragStart, onDragOver, onDrop}) => {
    
    if(!team){
        return(
            <div onDragOver={(e) => onDragOver(e)} 
                    onDrop={(e) => onDrop(e, e.dataTransfer.getData("source"), 
                                            e.dataTransfer.getData("id"), 
                                            'team')}
            >
                <h1>Drag to add to team</h1>
            </div>
        )
    }
    else{
        return (
            <div onDragOver={(e) => onDragOver(e)} 
                    onDrop={(e) => onDrop(e, e.dataTransfer.getData("source"), 
                                            e.dataTransfer.getData("id"), 
                                            'team')}
            >
                <h3 className="team-header">Team</h3>
                <div className ="team-flex">
                    {team.map((obj) => (
                    <div className="team-object" key={obj._id}>
                        <TeamMember key={obj._id} onDragStart={onDragStart} inspect={inspect} obj={obj} />
                    </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default Team
