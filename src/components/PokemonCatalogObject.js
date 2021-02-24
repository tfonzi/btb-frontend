import Image from 'react-bootstrap/Image'

import './components.css'

const PokemonCatalogObject = ({pokemon, inspect, onDragStart}) => {
    return (
        <div onDragStart={(e) => onDragStart(e, pokemon.id, 'pokemonCatalog')} draggable onClick={() => inspect(pokemon.id)}>
            <Image draggable="false" src={pokemon.image}/>
            <p className="p">{pokemon.name}</p>
            <p className="p">{pokemon.id}</p>
        </div>
    )
}

export default PokemonCatalogObject
