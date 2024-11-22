import React, { useState } from 'react';
import { Nav, Button, Offcanvas } from 'react-bootstrap';
import './sidebar.css';

const Sidebar = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Botão de menu para telas menores */}
      <Button 
        variant="dark" 
        className="menu-button d-md-none" 
        onClick={handleShow}
      >
        ☰
      </Button>

      {/* Sidebar como Offcanvas*/}
      <Offcanvas show={show} onHide={handleClose} className="sidebar-offcanvas">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>IT Fácil</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column sidebar-nav">
            <Button variant="light" className="sidebar-button shadow-sm">
              Home
            </Button>
            <Button variant="light" className="sidebar-button shadow-sm">
              Máquinas em uso
            </Button>
            <Button variant="light" className="sidebar-button shadow-sm">
              Máquinas Backup
            </Button>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Sidebar fixa*/}
      <div className="sidebar d-none d-md-flex">
        <div className="sidebar-logo">
          <img
            src="WhatsApp Image 2024-11-22 at 14.57.00.jpeg"
            alt="IT Fácil"
            className="logo-image"
          />
        </div>
        <Nav className="flex-column sidebar-nav">
          <Button variant="light" className="sidebar-button shadow-sm">
            Home
          </Button>
          <Button variant="light" className="sidebar-button shadow-sm">
          Máquinas em uso
          </Button>
          <Button variant="light" className="sidebar-button shadow-sm">
            Máquinas Backup
          </Button>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;
