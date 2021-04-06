import TeamMember from './TeamMember'
import {useEffect} from 'react'

import './components.css'

const Team = ({team, inspect, onDragStart, onDragOver, onDrop, scrollState, active}) => {
    
    useEffect(() => {
        var el = document.getElementById("TeamScroll")
        if(el){
            el.scrollTop = scrollState
        }
    })

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
                <div id="TeamScroll" className ="team-flex">
                    {team.map((obj) => (
                        <div key={obj._id}>
                            {(active == `team ${obj._id}`) && <div className="active-team-object" key={obj._id}> 
                                <TeamMember key={obj._id} onDragStart={onDragStart} inspect={inspect} obj={obj} />
                            </div>}
                            {(active != `team ${obj._id}`) && <div className="team-object" key={obj._id}> 
                                <TeamMember key={obj._id} onDragStart={onDragStart} inspect={inspect} obj={obj} />
                            </div>}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default Team
