import React from "react";
import { Container, Form, FormControl } from "react-bootstrap";

const Home = () => {
  const sidebarWidth = "30%"; // Largura da sidebar

  return (
    <Container
      className="flex-column justify-content-center align-items-center text-center"
      style={{
        marginLeft: sidebarWidth, // Respeita a largura da sidebar
        height: "100vh",
      }}
    >
      {/* Título e Subtítulo */}
      <div>
        <h1 className="m-5">Inventário ITFácil</h1>
        <p className="text-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
      </div>

      {/* Barra de Pesquisa */}
      <Form className="w-100 m-5">
        <FormControl
          type="search"
          placeholder="Consultar máquina"
          className="shadow-sm"
          style={{
            padding: "1rem",
            borderRadius: "10px",
          }}
        />
      </Form>
    </Container>
  );
};

export default Home;
