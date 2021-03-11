import {Link} from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'

import './components.css'
import 'bootstrap/dist/css/bootstrap.min.css';


const MenuBar = ({teamView, berryView, pokemonCatalogView, itemCatalogView, analysis}) => {

    return (
      <>
        <Navbar className="navbar" expand="lg" bg="dark" variant="dark">
          <Navbar.Brand >Pokemon Team Builder</Navbar.Brand>
          <Nav className="flex-row">
            <Nav.Item className="navbar-button">
              <Nav.Link onClick={teamView} > Team </Nav.Link>
            </Nav.Item>
            <Nav.Item className="navbar-button">
              <Nav.Link onClick={pokemonCatalogView} > Pokemon </Nav.Link>
            </Nav.Item>
            <Nav.Item className="navbar-button">
              <Nav.Link onClick={itemCatalogView} > Items </Nav.Link>
            </Nav.Item>
            <Nav.Item className="navbar-button">
              <Nav.Link onClick={analysis} > Analysis </Nav.Link>
            </Nav.Item>
          </Nav>
          
        </Navbar>
      </>
    )
}

export default MenuBar
