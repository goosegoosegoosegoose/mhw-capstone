import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../auth/userContext";
import { Container, Navbar, Nav } from "react-bootstrap";

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
        <Nav.Link className="mx-1" as={Link} to="/monsters">
          Monsters
        </Nav.Link>
        <Nav.Link className="mx-1" as={Link} to="/locations">
          Locations
        </Nav.Link>
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
        <Nav.Link  as={Link} to={`/profile/${name}`}>
          Profile
        </Nav.Link>
        <Nav.Link  as={Link} to={`/email/edit`}>
          Edit email
        </Nav.Link>
        <Nav.Link className="mx-4"  as={Link} to="/" onClick={logout}>
          Log out {currentUser ? currentUser.username : null }
        </Nav.Link>
      </Nav>
    </Navbar>
  )
}

export default NavbarComp;