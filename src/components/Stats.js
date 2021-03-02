import './components.css'

const Stats = ({stats}) => {
    
    if(stats == null){
        return null
    }
    else{
        return (
            <div>
                {stats.map(stat => (
                    <p key={stat.name} className="p">{stat.name} : {stat.base_stat}</p>
                ))}
            </div>
        )
    }
}

export default Stats
