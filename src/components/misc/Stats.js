import './misc.css'

const Stats = ({stats}) => {
    
    return (
        <div>
            {stats.map(stat => (
                <p key={stat.name} className="p-stats">{stat.name} : {stat.base_stat}</p>
            ))}
        </div>
    )
    
}

export default Stats
