import './components.css'

const Stats = ({stats}) => {
    return (
        <div>
            {stats.map(stat => (
                <p className="p">{stat.name} : {stat.base_stat}</p>
            ))}
        </div>
    )
}

export default Stats
