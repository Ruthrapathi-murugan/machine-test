import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';

function NavigationBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all localStorage or sessionStorage data related to authentication
    localStorage.removeItem('token');
    localStorage.removeItem('authStatus');

    // If you are using sessionStorage or any other state, clear that too
    sessionStorage.clear(); // This will clear everything stored in sessionStorage

    // Optionally clear any other cached data related to user session here

    // Redirect to the login page
    navigate('/login'); // or navigate('/') if the login page is at '/'
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">Machine-test</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/employee-list">Employee List</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
