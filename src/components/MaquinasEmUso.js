import React from "react";
import { Container, Table, InputGroup, FormControl } from "react-bootstrap";
import "./MaquinasEmUso.css";

const MaquinasEmUso = () => {
  // Dados das máquinas
  const machines = [
    { name: "Máquina 01", number: "001", ip: "192.168.0.1", client: "Cliente A", address: "Rua Exemplo, 123", city: "São Paulo" },
    { name: "Máquina 02", number: "002", ip: "192.168.0.2", client: "Cliente B", address: "Avenida Central, 456", city: "Rio de Janeiro" },
    { name: "Máquina 03", number: "003", ip: "192.168.0.3", client: "Cliente C", address: "Rua das Flores, 789", city: "Belo Horizonte" },
    { name: "Máquina 04", number: "004", ip: "192.168.0.4", client: "Cliente D", address: "Praça da Liberdade, 101", city: "Curitiba" },
    { name: "Máquina 05", number: "005", ip: "192.168.0.5", client: "Cliente E", address: "Rua do Sol, 202", city: "Porto Alegre" },
    { name: "Máquina 06", number: "006", ip: "192.168.0.6", client: "Cliente F", address: "Avenida Paulista, 303", city: "São Paulo" },
    { name: "Máquina 07", number: "007", ip: "192.168.0.7", client: "Cliente G", address: "Rua das Palmeiras, 404", city: "Florianópolis" },
    { name: "Máquina 08", number: "008", ip: "192.168.0.8", client: "Cliente H", address: "Estrada Nova, 505", city: "Recife" },
  ];

  return (
    <div className="machines-header">
      <Container className="machines-container">
        <h1 className="page-title">Máquinas em Uso</h1>

        {/* Barra de Pesquisa */}
        <div className="search-bar">
          <InputGroup>
            <FormControl
              placeholder="Pesquisa"
              aria-label="Pesquisa"
              className="search-input"
            />
          </InputGroup>
        </div>

        {/* Tabela */}
        <div className="table-container">
          <Table bordered responsive>
            <thead>
              <tr>
                <th>Nome da máquina</th>
                <th>Nº da máquina</th>
                <th>IP</th>
                <th>Cliente</th>
                <th>Endereço</th>
                <th>Cidade</th>
              </tr>
            </thead>
            <tbody>
              {machines.map((machine, index) => (
                <tr key={index}>
                  <td>{machine.name}</td>
                  <td>{machine.number}</td>
                  <td>{machine.ip}</td>
                  <td>{machine.client}</td>
                  <td>{machine.address}</td>
                  <td>{machine.city}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
};

export default MaquinasEmUso;
