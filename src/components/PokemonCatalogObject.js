import Image from 'react-bootstrap/Image'

import './components.css'
import 'bootstrap/dist/css/bootstrap.min.css'


const PokemonCatalogObject = ({pokemon, inspect, onDragStart}) => {
    return (
        <div onDragStart={(e) => onDragStart(e, pokemon.id, 'pokemonCatalog')} draggable onClick={() => inspect(pokemon.id)}>
            <Image loading="lazy" className="pokemonCatalog-image" draggable="false" src={pokemon.image}/>
            <p className="pokemonCatalog-p">{pokemon.name}</p>
        </div>
    )
}

export default PokemonCatalogObject
