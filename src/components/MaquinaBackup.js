import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

const MaquinasBackup = () => {
  const [backupMachines, setBackupMachines] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentMachine, setCurrentMachine] = useState({
    serialNumber: '',
    hostname: '',
    model: '',
    status: '',
    observation: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    fetchBackupMachines();
  }, []);

  const fetchBackupMachines = async () => {
    try {
      const response = await axios.get('http://10.5.8.145:5005/backup_machines');
      setBackupMachines(response.data);
    } catch (error) {
      setAlert({ show: true, message: 'Erro ao carregar máquinas de backup.', variant: 'danger' });
    }
  };

  const handleShowAddModal = () => {
    setCurrentMachine({ serialNumber: '', hostname: '', model: '', status: '', observation: '' });
    setShowAddModal(true);
  };

  const handleShowEditModal = (machine) => {
    setCurrentMachine(machine);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setCurrentMachine({ serialNumber: '', hostname: '', model: '', status: '', observation: '' });
  };

  const handleSaveMachine = async () => {
    try {
      await axios.post('http://10.5.8.145:5005/add_backup_machine', currentMachine);
      setAlert({ show: true, message: 'Máquina de backup adicionada com sucesso.', variant: 'success' });
      fetchBackupMachines();
      handleCloseModal();
    } catch (error) {
      setAlert({ show: true, message: 'Erro ao adicionar a máquina de backup.', variant: 'danger' });
    }
  };

  const handleUpdateMachine = async () => {
    try {
      await axios.post('http://10.5.8.145:5005/edit_backup_machine', currentMachine);
      setAlert({ show: true, message: 'Máquina de backup atualizada com sucesso.', variant: 'success' });
      fetchBackupMachines();
      handleCloseModal();
    } catch (error) {
      setAlert({ show: true, message: 'Erro ao atualizar a máquina de backup.', variant: 'danger' });
    }
  };

  const handleRemoveMachine = async (serialNumber) => {
    try {
      await axios.post('http://10.5.8.145:5005/remove_backup_machine', { serialNumber });
      setAlert({ show: true, message: 'Máquina de backup removida com sucesso.', variant: 'success' });
      fetchBackupMachines();
    } catch (error) {
      setAlert({ show: true, message: 'Erro ao remover a máquina de backup.', variant: 'danger' });
    }
  };

  return (
    <div className="container mt-4 d-grid gap-2">
      <h2 className="text-center">Máquinas Backup</h2>
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
            {backupMachines.map((machine) => (
              <tr key={machine.serialNumber}>
                <td>{machine.hostname}</td>
                <td>{machine.serialNumber}</td>
                <td>{machine.modelo}</td>
                <td>{machine.status}</td>
                <td>{machine.observacoes}</td>
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
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal para Adicionar Máquina */}
      <Modal show={showAddModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Máquina de Backup</Modal.Title>
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
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <div>
                {['Nova', 'Usada em bom estado', 'Máquina com Problema'].map((option) => (
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

      {/* Modal para Editar Máquina */}
      <Modal show={showEditModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Máquina de Backup</Modal.Title>
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
                placeholder="Modelo da Máquina"
                value={currentMachine.modelo}
                onChange={(e) => setCurrentMachine({ ...currentMachine, modelo: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <div>
                {['Nova', 'Usada em bom estado', 'Máquina com Problema'].map((option) => (
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
                value={currentMachine.observacoes}
                onChange={(e) => setCurrentMachine({ ...currentMachine, observacoes: e.target.value })}
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

export default MaquinasBackup;