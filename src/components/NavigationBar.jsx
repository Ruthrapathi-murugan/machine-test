import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';

function NavigationBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all localStorage data related to authentication
    localStorage.removeItem('token');
    localStorage.removeItem('authStatus');
    localStorage.removeItem('userName'); // Clear user name
    sessionStorage.clear();

    // Redirect to the login page
    navigate('/login');
  };

  // Retrieve user name from localStorage
  const userName = localStorage.getItem('userName');

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
            {userName ? <span className="me-3">Hello, {userName}!</span> : null} {/* Display user name */}
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
