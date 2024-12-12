import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  InputGroup,
  FormControl,
  Row,
  Col,
  DropdownButton,
  Dropdown,
  Accordion,
  Card,
} from "react-bootstrap";
import "./MaquinasEmUso.css";

const MachinesTable = ({ title, machines, onRowClick, expandedId }) => (
  <>
  <div className="table-responsive ">
    <h5 className="text-center mt-3">{title}</h5>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Hostname</th>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Número de Série</th>
          </tr>
        </thead>
        <tbody>
          {machines.length > 0 ? (
            machines.map((machine) => (
              <React.Fragment key={machine.Hostname}>
                <tr
                  onClick={() => onRowClick(machine.Hostname)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{machine.Hostname}</td>
                  <td>{machine.name}</td>
                  <td>{machine.Categoria}</td>
                  <td>{machine.SerialNumber}</td>
                </tr>
                {expandedId === machine.Hostname && (
                  <tr>
                    <td colSpan="4" className="bg-light">
                      <Accordion>
                        <Card className="text-center text-muted m-2">
                          <strong>Empresa:</strong> {machine.Empresa} <br />
                        </Card>
                        <Card className="text-center text-muted m-2">
                          <strong>Sistema Operacional:</strong> {machine.SistemaOperacional} <br />
                        </Card>
                        <Card className="text-center text-muted m-2">
                          <strong>Modelo:</strong> {machine.Modelo} <br />
                        </Card>
                        <Card className="text-center text-muted m-2">
                          <strong>Fabricante:</strong> {machine.Fabricante} <br />
                        </Card>
                        <Card className="text-center text-muted m-2">
                          <strong>Armazenamento:</strong> {machine.Armazenamento} <br />
                        </Card>
                        <Card className="text-center text-muted m-2">
                          <strong>Domínio:</strong> {machine.Dominio} <br />
                        </Card>
                        <Card className="text-center text-muted m-2">
                          <strong>Serial Windows:</strong> {machine.SerialWindows} <br />
                        </Card>
                      </Accordion>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                Nenhuma máquina encontrada
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  </>
);

function MaquinasEmUso({ machines }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const [expandedId, setExpandedId] = useState(null);

  const normalizeText = (text) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      let filtered = machines;

      if (searchTerm.trim()) {
        const normalizedSearchTerm = normalizeText(searchTerm);
        filtered = machines.filter((machine) => {
          const normalizedMachineName = normalizeText(machine.name);
          const normalizedMachineId = normalizeText(machine.Hostname);
          return (
            normalizedMachineName.includes(normalizedSearchTerm) ||
            normalizedMachineId.includes(normalizedSearchTerm)
          );
        });
      }

      if (selectedCategory !== "Todas") {
        filtered = filtered.filter(
          (machine) => machine.Categoria === selectedCategory
        );
      }

      setFilteredMachines(filtered);
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchTerm, selectedCategory, machines]);

  const toggleDetails = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="main-content">
      <Container>
        <Row className="mb-4 text-center">
          <Col>
            <h1 className="mt-3">Máquinas em Uso</h1>
            <h5>
              Total: <strong>{machines.length}</strong>
            </h5>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12} md={12} className="mb-2">
            <InputGroup>
              <FormControl
                placeholder="Pesquisar máquina por nome ou hostname"
                aria-label="Pesquisar máquina"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col xs={12} md={12} className="text-md-right text-center">
            <DropdownButton
              title={`Categoria: ${selectedCategory}`}
              onSelect={(e) => setSelectedCategory(e)}
              className="dropdown-button-category"
            >
              <Dropdown.Item eventKey="Todas">Todas</Dropdown.Item>
              <Dropdown.Item eventKey="Desktop">Desktop</Dropdown.Item>
              <Dropdown.Item eventKey="Laptop">Laptop</Dropdown.Item>
              <Dropdown.Item eventKey="Server">Server</Dropdown.Item>
            </DropdownButton>
          </Col>
        </Row>

        {searchTerm || selectedCategory !== "Todas" ? (
          <Row className="mt-4">
            <Col>
              <MachinesTable
                title="Resultados da Pesquisa"
                machines={filteredMachines}
                onRowClick={toggleDetails}
                expandedId={expandedId}
              />
            </Col>
          </Row>
        ) : null}

        <Row>
          <Col>
            <MachinesTable
              title="Todas as Máquinas"
              machines={machines}
              onRowClick={toggleDetails}
              expandedId={expandedId}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MaquinasEmUso;