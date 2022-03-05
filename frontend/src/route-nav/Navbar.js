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
          <NavDropdown.Item className="ps-4 py-2" as={Link} style={{color: "#666666"}} to="/monsters">
            Monsters
          </NavDropdown.Item>
          <NavDropdown.Item className="ps-4 py-2" as={Link} style={{color: "#666666"}} to="/locations">
            Locations
          </NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title="Equipment">
          <NavDropdown.Item className="ps-4 py-2" as={Link} style={{color: "#666666"}} to="/armor-sets">
            Armor Sets
          </NavDropdown.Item>
          <NavDropdown.Item className="ps-4 py-2" as={Link} style={{color: "#666666"}} to="/armor">
            Armor
          </NavDropdown.Item>
          <NavDropdown.Item className="ps-4 py-2" as={Link} style={{color: "#666666"}} to="/weapons">
            Weapons
          </NavDropdown.Item>
          <NavDropdown.Item className="ps-4 py-2" as={Link} style={{color: "#666666"}} to="/charms">
            Charms
          </NavDropdown.Item>
          <NavDropdown.Item className="ps-4 py-2" as={Link} style={{color: "#666666"}} to="/decorations">
            Decorations
          </NavDropdown.Item>
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
          <NavDropdown.Item className="ps-4 py-2" as={Link} style={{color: "#666666"}} to={`/profile/${name}`}>
            Profile
          </NavDropdown.Item>
          <NavDropdown.Item className="ps-4 py-2" as={Link} style={{color: "#666666"}} to={`/email/edit`}>
            Edit Email
          </NavDropdown.Item>
          <NavDropdown.Item className="ps-4 py-2" as={Link} style={{color: "#666666"}} to={"/"} onClick={logout}>
            Logout
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar>
  )
}

export default NavbarComp;