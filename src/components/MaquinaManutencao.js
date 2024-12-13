import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

const MaquinasEmManutencao = () => {
  const [machinesUnderMaintenance, setMachinesUnderMaintenance] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentMachine, setCurrentMachine] = useState({
    serialNumber: '',
    hostname: '',
    model: '',
    defect: '',  // Novo campo para o defeito
    status: '',
    observation: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    fetchMachinesUnderMaintenance();
  }, []);

  const fetchMachinesUnderMaintenance = async () => {
    try {
      const response = await axios.get('http://10.5.9.45:5000/machines_under_maintenance');
      setMachinesUnderMaintenance(response.data);
    } catch (error) {
      setAlert({ show: true, message: 'Erro ao carregar máquinas em manutenção.', variant: 'danger' });
    }
  };

  const handleShowAddModal = () => {
    setCurrentMachine({ serialNumber: '', hostname: '', model: '', defect: '', status: '', observation: '' });
    setShowAddModal(true);
  };

  const handleShowEditModal = (machine) => {
    setCurrentMachine(machine);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setCurrentMachine({ serialNumber: '', hostname: '', model: '', defect: '', status: '', observation: '' });
  };

  const handleSaveMachine = async () => {
    try {
      await axios.post('http://10.5.9.45:5000/add_machine_under_maintenance', currentMachine);
      setAlert({ show: true, message: 'Máquina adicionada à manutenção com sucesso.', variant: 'success' });
      fetchMachinesUnderMaintenance();
      handleCloseModal();
    } catch (error) {
      setAlert({ show: true, message: 'Erro ao adicionar a máquina à manutenção.', variant: 'danger' });
    }
  };

  const handleUpdateMachine = async () => {
    try {
      await axios.post('http://10.5.9.45:5000/edit_machine_under_maintenance', currentMachine);
      setAlert({ show: true, message: 'Máquina atualizada com sucesso.', variant: 'success' });
      fetchMachinesUnderMaintenance();
      handleCloseModal();
    } catch (error) {
      setAlert({ show: true, message: 'Erro ao atualizar a máquina.', variant: 'danger' });
    }
  };

  const handleRemoveMachine = async (serialNumber) => {
    try {
      await axios.post('http://10.5.9.45:5000/remove_machine_under_maintenance', { serialNumber });
      setAlert({ show: true, message: 'Máquina removida da manutenção com sucesso.', variant: 'success' });
      fetchMachinesUnderMaintenance();
    } catch (error) {
      setAlert({ show: true, message: 'Erro ao remover a máquina da manutenção.', variant: 'danger' });
    }
  };

  const handleMarkMachineAsReady = async (serialNumber) => {
    try {
      await axios.post('http://10.5.9.45:5000/update_machine_status', { serialNumber, status: 'Pronto' });
      setAlert({ show: true, message: 'Máquina marcada como pronta com sucesso.', variant: 'success' });
      fetchMachinesUnderMaintenance();
    } catch (error) {
      setAlert({ show: true, message: 'Erro ao marcar a máquina como pronta.', variant: 'danger' });
    }
  };

  return (
    <div className="container mt-4 d-grid gap-2">
      <h2 className="text-center">Máquinas em Manutenção</h2>
      {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
      <Button variant="primary" size="lg" className="mb-5" onClick={handleShowAddModal}>
        Adicionar Máquina
      </Button>
      <div className='table-responsive'>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Hostname</th>
              <th>Serial Number</th>
              <th>Modelo</th>
              <th>Status</th>
              <th>Observação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {machinesUnderMaintenance.map((machine) => (
              <tr key={machine.serialNumber}>
                <td>{machine.hostname}</td>
                <td>{machine.serialNumber}</td>
                <td>{machine.model}</td>
                <td>{machine.status}</td>
                <td>{machine.observation}</td>
                <td>
                  <Button
                    variant="warning"
                    className="me-4"
                    onClick={() => handleShowEditModal(machine)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveMachine(machine.serialNumber)}
                  >
                    Remover
                  </Button>
                  {machine.status !== 'Pronto' && (
                    <Button
                      variant="success"
                      className="ms-4"
                      onClick={() => handleMarkMachineAsReady(machine.serialNumber)}
                    >
                      Pronto
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal para Adicionar Máquina em Manutenção */}
      <Modal show={showAddModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Máquina em Manutenção</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Serial Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Serial Number"
                value={currentMachine.serialNumber}
                onChange={(e) => setCurrentMachine({ ...currentMachine, serialNumber: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hostname</Form.Label>
              <Form.Control
                type="text"
                placeholder="Hostname"
                value={currentMachine.hostname}
                onChange={(e) => setCurrentMachine({ ...currentMachine, hostname: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Modelo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Modelo da Máquina"
                value={currentMachine.model}
                onChange={(e) => setCurrentMachine({ ...currentMachine, model: e.target.value })}
              />
            </Form.Group>
            {/* Novo campo de Defeito */}
            <Form.Group className="mb-3">
              <Form.Label>Defeito</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Descreva o defeito da máquina"
                value={currentMachine.defect}
                onChange={(e) => setCurrentMachine({ ...currentMachine, defect: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <div>
                {['Em Reparação', 'Aguardando Peças', 'Em Testes', 'Pronto'].map((option) => (
                  <Form.Check
                    type="radio"
                    name="status"
                    label={option}
                    key={option}
                    checked={currentMachine.status === option}
                    onChange={() => setCurrentMachine({ ...currentMachine, status: option })}
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Observação</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Observações (opcional)"
                value={currentMachine.observation}
                onChange={(e) => setCurrentMachine({ ...currentMachine, observation: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveMachine}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para Editar Máquina em Manutenção */}
      <Modal show={showEditModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Máquina em Manutenção</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Serial Number</Form.Label>
              <Form.Control
                type="text"
                value={currentMachine.serialNumber}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hostname</Form.Label>
              <Form.Control
                type="text"
                value={currentMachine.hostname}
                onChange={(e) => setCurrentMachine({ ...currentMachine, hostname: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Modelo</Form.Label>
              <Form.Control
                type="text"
                value={currentMachine.model}
                onChange={(e) => setCurrentMachine({ ...currentMachine, model: e.target.value })}
              />
            </Form.Group>
            {/* Novo campo de Defeito */}
            <Form.Group className="mb-3">
              <Form.Label>Defeito</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentMachine.defect}
                onChange={(e) => setCurrentMachine({ ...currentMachine, defect: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <div>
                {['Em Reparação', 'Aguardando Peças', 'Em Testes', 'Pronto'].map((option) => (
                  <Form.Check
                    type="radio"
                    name="status"
                    label={option}
                    key={option}
                    checked={currentMachine.status === option}
                    onChange={() => setCurrentMachine({ ...currentMachine, status: option })}
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Observação</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentMachine.observation}
                onChange={(e) => setCurrentMachine({ ...currentMachine, observation: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateMachine}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MaquinasEmManutencao;
