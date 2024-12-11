import React from 'react';
import { Card, Container, Row, Col, Form, FormControl } from 'react-bootstrap';
import './Home.css';

const Home = () => {
  const cards = [
    {
      title: 'Máquinas Backup',
      description: 'Lista das máquinas de backup.',
      image: '/2987889.jpg',
      link: '/backup',
    },
    {
      title: 'Máquinas ITFácil',
      description: 'Lista das máquinas ITFácil.',
      image: '/4114328.jpg',
      link: '/itfacil',
    },
    {
      title: 'Máquinas em uso',
      description: 'Lista das máquinas em uso (ECOM).',
      image: '/56452.jpg',
      link: '/maquinas-em-uso',
    },
    {
      title: 'Máquinas em manutenção',
      description: 'Lista das máquinas em manutenção.',
      image: '/368724.jpg',
      link: '/manutencao',
    },
  ];

  const handleCardClick = (link) => {
    window.location.href = link;
  };

  return (
    <Container
      className="flex-column justify-content-center align-items-center text-center"
    >
      {/* Título e Subtítulo */}
      <div>
        <h1 className="m-5">Inventário ITFácil</h1>
        <p className="text-muted">
        <strong>Bem-vindo ao Sistema de Gerenciamento e Monitoramento de Máquinas<br></br></strong>
        Este sistema foi criado para facilitar o controle e acompanhamento das máquinas em diferentes ambientes.
        Aqui, você pode gerenciar informações essenciais, monitorar o status de cada máquina e otimizar a gestão com eficiência e praticidade.
        </p>
      </div>
      {/* Barra de pesquisa */}
      <div className="search-bar mb-4">
        <Form className="w-100">
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
      </div>

      {/* Seção de cards */}
      <Row>
        {cards.map((card, index) => (
          <Col key={index} sm={12} md={6} lg={3} className="mb-4">
            <Card
              className="custom-card"
              onClick={() => handleCardClick(card.link)}
            >
              <Card.Img variant="top" src={card.image} alt={card.title} />
              <Card.Body>
                <Card.Title>{card.title}</Card.Title>
                <Card.Text>{card.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;