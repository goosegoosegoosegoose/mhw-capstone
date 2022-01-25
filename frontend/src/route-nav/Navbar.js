import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import UserContext from "../auth/userContext";
import { Container, Navbar, Nav } from "react-bootstrap";


const NavbarComp = ({logout, loggedIn}) => {
  const currentUser = useContext(UserContext);

  if (!loggedIn) {
    return (
      <Navbar bg="dark" variant="dark">
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
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand className="mx-4">
        <NavLink to="/">
          Monster Hunter World
        </NavLink>
      </Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link>
          <NavLink to="/logout" onClick={logout}>
            Log out {currentUser ? currentUser.username : null }
          </NavLink>
        </Nav.Link>
        <Nav.Link>
          <NavLink to="/monsters">
            Monsters
          </NavLink>
        </Nav.Link>
        <Nav.Link>
          <NavLink to="/items">
            Items
          </NavLink>
        </Nav.Link>
        <Nav.Link>
          <NavLink to="/weapons">
            Weapons
          </NavLink>
        </Nav.Link>
        <Nav.Link>
          <NavLink to="/armors">
            Armors
          </NavLink>
        </Nav.Link>
        <Nav.Link>
          <NavLink to="/armor-sets">
            Armor Sets
          </NavLink>
        </Nav.Link>
        <Nav.Link>
          <NavLink to="/charms">
            Charms
          </NavLink>
        </Nav.Link>
        <Nav.Link>
          <NavLink to="/decorations">
            Decorations
          </NavLink>
        </Nav.Link>
      </Nav>
    </Navbar>
  )
}

export default NavbarComp;