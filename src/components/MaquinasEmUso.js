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
  Button,
  Spinner,
  Modal
} from "react-bootstrap";

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
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('updating');
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const [expandedId, setExpandedId] = useState(null);

  const handleUpdateAPI = async () => {
    setShowUpdateModal(true);
    setUpdateStatus('updating');
    
    try {
      const response = await fetch('http://10.5.8.145:5005/update-machines');
      if (response.status === 200) {
        setUpdateStatus('success');
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      setUpdateStatus('error');
    }
  };

  const handleSuccess = () => {
    window.location.reload();
  };

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
        <div className="container mt-2 d-grid gap-2">
          <Button variant="success" size="lg" className="mb-4" onClick={handleUpdateAPI}>
            Atualizar lista de máquinas
          </Button>
        </div>
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
      <Modal
        show={showUpdateModal}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body className="text-center p-4">
          {updateStatus === 'updating' && (
            <>
              <Spinner animation="border" className="mb-3" />
              <h4>Atualizando lista de máquinas</h4>
              <p>Por favor, não feche esta janela até a atualização ser concluída.</p>
              <p>Tempo minimo: 3min</p>
              <p className="mt-2">- Fazendo request para API do Defender;</p>
              <p className="mt-2">- Organizando lista para inserção no banco de dados;</p>
              <p className="mt-2">- Inserindo informações no banco de dados (Limite de inserções por minuto, sendo necessário aguardar alguns segundos).</p>
            </>
          )}
          
          {updateStatus === 'success' && (
            <>
              <h4>Atualização concluída!</h4>
              <Button 
                variant="primary"
                onClick={handleSuccess}
                className="mt-3"
              >
                Entendido!
              </Button>
            </>
          )}
          
          {updateStatus === 'error' && (
            <>
              <h4>Erro na atualização</h4>
              <p>Ocorreu um erro ao atualizar a lista. Por favor, tente novamente.</p>
              <Button 
                variant="danger"
                onClick={() => setShowUpdateModal(false)}
                className="mt-3"
              >
                Fechar
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default MaquinasEmUso;