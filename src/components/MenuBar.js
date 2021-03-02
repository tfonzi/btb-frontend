import {Link} from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'

import './components.css'
import 'bootstrap/dist/css/bootstrap.min.css';


const MenuBar = ({teamView, berryView, pokemonCatalogView, itemCatalogView}) => {

    return (
      <>
        <Navbar expand="lg" bg="dark" variant="dark">
          <Navbar.Brand >Pokemon Team Builder</Navbar.Brand>
          <Nav className="flex-row">
            <Nav.Item >
              <Nav.Link onClick={teamView} > Team </Nav.Link>
            </Nav.Item>
            <Nav.Item >
              <Nav.Link onClick={pokemonCatalogView} > Pokemon </Nav.Link>
            </Nav.Item>
            <Nav.Item >
              <Nav.Link onClick={itemCatalogView} > Items </Nav.Link>
            </Nav.Item>
            <Nav.Item >
              <Link to='/debug'> Debug</Link>
            </Nav.Item>
          </Nav>
          
        </Navbar>
      </>
    )
}

export default MenuBar
