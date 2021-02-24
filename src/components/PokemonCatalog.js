import PokemonCatalogObject from './PokemonCatalogObject'

import './components.css'

const PokemonCatalog = ({pokemons, inspect, onDragStart}) => {
    return (
        <>
            <h3 className="pokemonCatalog-header">Pokemon Catalog</h3>
            <div className="pokemonCatalog-flex">
                {pokemons.map((pokemon) => (
                <div className="pokemonCatalog-object" key={pokemon.id}>
                    <PokemonCatalogObject key={pokemon.id} onDragStart={onDragStart} inspect={inspect} pokemon={pokemon} />
                </div>
                ))}
            </div>
        </>
    )
}

export default PokemonCatalog
