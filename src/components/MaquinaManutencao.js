import React from "react";
import {
  Container,
  Row,
  Col
} from "react-bootstrap";


function MaquinasManutencao({ machines  }) {
  return (
    <div className="main-content">
      <Container>
        <Row className="mb-4 text-center">
          <Col>
            <h1 className="mt-3">Máquinas em Manutenção</h1>
            <h5>Página em manutenção...</h5>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MaquinasManutencao;