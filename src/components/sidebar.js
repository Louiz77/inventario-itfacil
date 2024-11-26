import React, { useState } from 'react';
import { Nav, Button, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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
            <Link to="/" className="btn btn-light sidebar-button shadow-sm">
              Home
            </Link>
            <Link to="/maquinas-em-uso" className="btn btn-light sidebar-button shadow-sm">
              Máquinas em uso
            </Link>
            <Link to="/backup" className="btn btn-light sidebar-button shadow-sm">
              Máquinas Backup
            </Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Sidebar fixa */}
      <div className="sidebar d-none d-md-flex">
        <div className="sidebar-logo">
          <img
            src="WhatsApp Image 2024-11-22 at 14.57.00.jpeg"
            alt="IT Fácil"
            className="logo-image"
          />
        </div>
        <Nav className="flex-column sidebar-nav">
          <Link to="/" className="btn btn-light sidebar-button shadow-sm">
            Home
          </Link>
          <Link to="/maquinas-em-uso" className="btn btn-light sidebar-button shadow-sm">
            Máquinas em uso
          </Link>
          <Link to="/backup" className="btn btn-light sidebar-button shadow-sm">
            Máquinas Backup
          </Link>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;
