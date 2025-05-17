import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { SignOutButton } from "@clerk/clerk-react";
import './Navbar.css';

const NavbarComp = () => {
  return (
    <Navbar expand="lg" fixed="top" className="custom-navbar">
      <Container fluid className="px-3">
        <Navbar.Brand className="navbar-brand-custom me-auto" href="#home">
          Risk Tracker
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          className="custom-toggler" 
        >
          <span className="navbar-toggler-icon">
            <span className="custom-line"></span>
          </span>
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/dashboard" className="custom-nav-link">Home</Nav.Link>
            <Nav.Link as={Link} to="/about" className="custom-nav-link">About</Nav.Link>
            <Nav.Link as={Link} to="/contact" className="custom-nav-link">Contact Us</Nav.Link>
            <SignOutButton signOutCallback={() => window.location.href = '/login'}>
              <Nav.Link className="custom-nav-link">Sign Out</Nav.Link>
            </SignOutButton>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComp;

