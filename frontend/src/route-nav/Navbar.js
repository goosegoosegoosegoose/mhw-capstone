import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import UserContext from "../auth/userContext";
import { Container, Navbar, Nav } from "react-bootstrap";


const NavbarComp = ({logout, loggedIn}) => {
  const currentUser = useContext(UserContext);

  if (!loggedIn) {
    return (
      <Navbar sticky="top" bg="light" variant="light">
        <Navbar.Brand className="mx-4">
          <NavLink to="/">
            Monster Hunter World
          </NavLink>
        </Navbar.Brand>
        <Nav className="me-auto"> 
          <Nav.Link> 
            <NavLink to="/signup">
              Sign up
            </NavLink>
          </Nav.Link> 
          <Nav.Link> 
            <NavLink to="/login">
              Login
            </NavLink>
          </Nav.Link> 
        </Nav>
      </Navbar>
    )
  }

  return (
    <Navbar sticky="top" bg="light" variant="light">
      <Navbar.Brand className="mx-4" href="/">
        Monster Hunter World
      </Navbar.Brand>
      <Nav className="me-auto">
      <Nav.Link className="mx-1" href="/monsters">
          Monsters
        </Nav.Link>
        <Nav.Link className="mx-1" href="/locations">
          Locations
        </Nav.Link>
        <Nav.Link className="mx-1" href="/armor-sets">
          Armor Sets
        </Nav.Link>
        <Nav.Link className="mx-1" href="/armor">
          Armor
        </Nav.Link>
        <Nav.Link className="mx-1" href="/weapons">
          Weapons
        </Nav.Link>
        <Nav.Link className="mx-1" href="/charms">
          Charms
        </Nav.Link>
        <Nav.Link className="mx-1" href="/decorations">
          Decorations
        </Nav.Link>
        <Nav.Link className="mx-1" href="/skills">
          Skills
        </Nav.Link>
        <Nav.Link className="mx-1" href="/elements">
          Elements
        </Nav.Link>
      </Nav>
      <Nav className="ms-auto">
        <Nav.Link className="mx-4" href="/logout" onClick={logout}>
          Log out {currentUser ? currentUser.username : null }
        </Nav.Link>
      </Nav>
    </Navbar>
  )
}

export default NavbarComp;