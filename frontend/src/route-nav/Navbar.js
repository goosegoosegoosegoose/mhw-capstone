import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../auth/userContext";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

const NavbarComp = ({logout, loggedIn, name}) => {
  const currentUser = useContext(UserContext);

  if (!loggedIn) {
    return (
      <Navbar sticky="top" bg="light" variant="light">
       <Navbar.Brand className="mx-4" as={Link} to="/">
          Monster Hunter World
        </Navbar.Brand>
        <Nav className="ms-auto"> 
          <Nav.Link className="mx-1" as={Link} to="/signup"> 
            Sign up
          </Nav.Link> 
          <Nav.Link className="ms-1 me-4" as={Link} to="/login"> 
            Login
          </Nav.Link> 
        </Nav>
      </Navbar>
    )
  }

  return (
    <Navbar sticky="top" bg="light" variant="light">
      <Navbar.Brand className="mx-4" as={Link} to="/">
        Monster Hunter World
      </Navbar.Brand>
      <Nav className="me-auto">
        <NavDropdown title="World">
          <Nav.Link className="mx-1" as={Link} to="/monsters">
            Monsters
          </Nav.Link>
          <Nav.Link className="mx-1" as={Link} to="/locations">
            Locations
          </Nav.Link>
        </NavDropdown>
        <NavDropdown title="Equipment">
          <Nav.Link className="mx-1" as={Link} to="/armor-sets">
            Armor Sets
          </Nav.Link>
          <Nav.Link className="mx-1" as={Link} to="/armor">
            Armor
          </Nav.Link>
          <Nav.Link className="mx-1" as={Link} to="/weapons">
            Weapons
          </Nav.Link>
          <Nav.Link className="mx-1" as={Link} to="/charms">
            Charms
          </Nav.Link>
          <Nav.Link className="mx-1" as={Link} to="/decorations">
            Decorations
          </Nav.Link>
        </NavDropdown>
        <Nav.Link className="mx-1" as={Link} to="/skills">
          Skills
        </Nav.Link>
        <Nav.Link className="mx-1" as={Link} to="/elements">
          Elements
        </Nav.Link>
      </Nav>
      <Nav className="ms-auto">
          <Nav.Link  as={Link} to={`/gearing/${name}`}>
            Gearing
          </Nav.Link>
        <NavDropdown className="me-5" title={currentUser.username}>
          <Nav.Link  as={Link} to={`/profile/${name}`}>
            Profile
          </Nav.Link>
          <Nav.Link  as={Link} to={`/email/edit`}>
            Edit email
          </Nav.Link>
          <Nav.Link  as={Link} to="/" onClick={logout}>
            Log out
          </Nav.Link>
        </NavDropdown>
      </Nav>
    </Navbar>
  )
}

export default NavbarComp;