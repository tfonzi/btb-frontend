import Item from './Item'
import {useEffect} from 'react'

import './components.css'

const ItemCatalog = ({items, inspect, onDragStart, active, scrollState}) => {
    
    useEffect(() => {
        var el = document.getElementById("ItemScroll")
        el.scrollTop = scrollState
    })

    return (
        <>
            <h3 className="itemCatalog-header">Item Catalog</h3>
            <div id="ItemScroll" className="itemCatalog-flex">
                {items.map((item) => (
                <div key={item.name}>
                    {(active == `itemCatalog ${item.name}`) && <div className="active-itemCatalog-object" key={item.name}> <Item  key={item.name} onDragStart={onDragStart} inspect={inspect} item={item} /> </div>}
                    {(active != `itemCatalog ${item.name}`) && <div className="itemCatalog-object" key={item.name}> <Item  key={item.name} onDragStart={onDragStart} inspect={inspect} item={item} /> </div>}
                </div>
                ))}
            </div>
        </>
    )
}

export default ItemCatalog