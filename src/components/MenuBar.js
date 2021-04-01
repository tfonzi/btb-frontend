import {Link} from 'react-router-dom'
import { useAuth0 } from "@auth0/auth0-react";
import {useState, useEffect} from 'react'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown  from 'react-bootstrap/NavDropdown'

import './components.css'
import 'bootstrap/dist/css/bootstrap.min.css';


const MenuBar = ({isAuthenticated, isLoading, user, teamView, pokemonCatalogView, itemCatalogView, analysis}) => {

    const { loginWithRedirect } = useAuth0();
    const { logout } = useAuth0();

    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {

      //Code for getting screen width
      const resizeWidth = () => {
          setWidth(window.innerWidth)
      }
      window.addEventListener('resize', resizeWidth)
      return _ => {
          window.removeEventListener('resize', resizeWidth)
      }
      
  }, [])

    if(width <= 991){ //Mobile
      return (
        <Navbar className="navbar" bg="dark" variant="dark">
          <Navbar.Brand className="navbar-header">
            <img className="navbar-image" src="\Bag_Oran_Berry_Sprite.png"/>
          </Navbar.Brand>
          <Nav className="mr-auto">
            <NavDropdown className="navbar-button" title="View">
              <NavDropdown.Item onClick={teamView}><p className="navbar-dropdown-text">Team</p></NavDropdown.Item>
              <NavDropdown.Item onClick={pokemonCatalogView}><p className="navbar-dropdown-text">Pokemon</p></NavDropdown.Item>
              <NavDropdown.Item onClick={itemCatalogView}><p className="navbar-dropdown-text">Items</p></NavDropdown.Item>
            </NavDropdown>
            <Nav.Item className="navbar-button">
                  <Nav.Link onClick={analysis} > Analysis </Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav className="mr-sm-2">
            {(isAuthenticated) && 
              <Navbar.Text>
                <Nav.Item>Welcome {user.name}</Nav.Item>
              </Navbar.Text>}
            {(!isAuthenticated) && 
              <Navbar.Text>
                <Nav.Item className="navbar-button">Welcome Guest</Nav.Item>
              </Navbar.Text>}
            {(!isAuthenticated && !isLoading) && <Nav.Item>
                <Nav.Link className="navbar-login-button btn btn-secondary" onClick={() => loginWithRedirect()} > Login </Nav.Link>
              </Nav.Item>}
              {(isAuthenticated && !isLoading) && 
              <Nav.Item>
                <Nav.Link onClick={() => logout({ returnTo: window.location.origin })} > Logout </Nav.Link>
              </Nav.Item>}
          </Nav>
        </Navbar>
      )
    }
    else{ //Desktop
      return (
        <Navbar className="navbar" expand="lg" bg="dark" variant="dark">
          <Navbar.Brand className="navbar-header">
            Pokemon Team Builder 
            <img className="navbar-image" src="\Bag_Oran_Berry_Sprite.png"/>
          </Navbar.Brand>
          <Nav className="mr-auto">
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
          <Nav className="mr-sm-2">
            {(isAuthenticated) && 
              <Navbar.Text>
                <Nav.Item>Welcome {user.name}</Nav.Item>
              </Navbar.Text>}
            {(!isAuthenticated) && 
              <Navbar.Text>
                <Nav.Item className="navbar-button">Welcome Guest</Nav.Item>
              </Navbar.Text>}
            {(!isAuthenticated && !isLoading) && <Nav.Item>
                <Nav.Link className="navbar-login-button btn btn-secondary" onClick={() => loginWithRedirect()} > Login </Nav.Link>
              </Nav.Item>}
              {(isAuthenticated && !isLoading) && 
              <Nav.Item>
                <Nav.Link onClick={() => logout({ returnTo: window.location.origin })} > Logout </Nav.Link>
              </Nav.Item>}
          </Nav>
        </Navbar>
      )
    }
}

export default MenuBar
