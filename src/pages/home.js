import React from 'react';
import { Container, Form, FormControl } from 'react-bootstrap';
import './home.css';

const Home = () => {
  return (
    <Container className="home-container">
      {/* Seção centralizada (titulo e sub) */}
      <div className="home-header">
        <h1 className="home-title">Inventário ITFácil</h1>
        <p className="home-subtitle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
      
      {/* Barra de pesquisa */}
      <Form className="home-search">
        <FormControl
          type="search"
          placeholder="Consultar máquina"
          className="shadow-sm home-search-bar m-4"
          style={{
            padding: '2%',
          }}
        />
      </Form>
    </Container>
  );
};

export default Home;
