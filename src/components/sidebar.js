import React from "react";
import { Nav, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import './sidebar.css';

const Sidebar = () => {
  return (
    <>
      <div
        className="sidebar"
      >
        {/* Logo */}
        <div className="p-3 text-center">
          <Image
            src="WhatsApp Image 2024-11-22 at 14.57.00.jpeg"
            alt="IT Fácil"
            rounded
            fluid
            style={{ maxWidth: "200px", height: "auto" }}
          />
        </div>

        {/* Links de navegação */}
        <Nav className="flex-column p-3">
          <Link to="/" className="btn btn-light mb-5">
            Home
          </Link>
          <Link to="/itfacil" className="btn btn-light mb-2">
            Máquinas ITFácil
          </Link>
          <Link to="/maquinas-em-uso" className="btn btn-light mb-2">
            Máquinas em uso
          </Link>
          <Link to="/backup" className="btn btn-light mb-2">
            Máquinas Backup
          </Link>
          <Link to="/manutencao" className="btn btn-light mb-2">
            Máquinas em manutenção
          </Link>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;
