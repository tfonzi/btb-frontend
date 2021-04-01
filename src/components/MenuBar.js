import {Link} from 'react-router-dom'
import { useAuth0 } from "@auth0/auth0-react";


import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'

import './components.css'
import 'bootstrap/dist/css/bootstrap.min.css';


const MenuBar = ({isAuthenticated, isLoading, user, teamView, berryView, pokemonCatalogView, itemCatalogView, analysis}) => {

    const { loginWithRedirect } = useAuth0();
    const { logout } = useAuth0();

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
            {(!isAuthenticated && !isLoading) && <Nav.Item className="navbar-button">
              <Nav.Link onClick={() => loginWithRedirect()} > Login </Nav.Link>
            </Nav.Item>}
            {(isAuthenticated && !isLoading) && 
            <Nav.Item className="navbar-button">
              <Nav.Link onClick={() => logout({ returnTo: window.location.origin })} > Logout </Nav.Link>
            </Nav.Item>}
            {(isAuthenticated) && 
              <Navbar.Text className="navbar-button">
                <Nav.Item>Welcome {user.name}</Nav.Item>
              </Navbar.Text>}
            {(!isAuthenticated) && 
              <Navbar.Text className="navbar-button">
                <Nav.Item>Welcome Guest</Nav.Item>
              </Navbar.Text>}
            
          </Nav>
          
        </Navbar>
      </>
    )
}

export default MenuBar
