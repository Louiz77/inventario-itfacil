import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

const MaquinasEmManutencao = () => {
  const [machinesUnderMaintenance, setMachinesUnderMaintenance] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [currentMachine, setCurrentMachine] = useState({
    serialNumber: '',
    hostname: '',
    model: '',
    defect: '',
    status: '',
    observation: ''
  });
  const [moveDestination, setMoveDestination] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    fetchMachinesUnderMaintenance();
  }, []);

  const fetchMachinesUnderMaintenance = async () => {
    try {
      const response = await axios.get('http://10.5.8.145:5005/maintence_machines');
      setMachinesUnderMaintenance(response.data);
    } catch (error) {
      setAlert({ show: true, message: 'Erro ao carregar máquinas em manutenção.', variant: 'danger' });
    }
  };

  const handleShowAddModal = () => {
    setCurrentMachine({ serial: '', hostname: '', model: '', defect: '', status: '', obs: '' });
    setShowAddModal(true);
  };

  const handleShowEditModal = (machine) => {
    setCurrentMachine(machine);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setCurrentMachine({ serial: '', hostname: '', model: '', defect: '', status: '', obs: '' });
  };

  const handleSaveMachine = async () => {
    try {
      await axios.post('http://10.5.8.145:5005/add_maintence_machines', currentMachine);
      setAlert({ show: true, message: 'Máquina adicionada à manutenção com sucesso.', variant: 'success' });
      fetchMachinesUnderMaintenance();
      handleCloseModal();
    } catch (error) {
      setAlert({ show: true, message: 'Erro ao adicionar a máquina à manutenção.', variant: 'danger' });
    }
  };

  const handleUpdateMachine = async () => {
    try {
      await axios.post('http://10.5.8.145:5005/edit_maintence_machines', currentMachine);
      setAlert({ show: true, message: 'Máquina atualizada com sucesso.', variant: 'success' });
      fetchMachinesUnderMaintenance();
      handleCloseModal();
    } catch (error) {
      setAlert({ show: true, message: 'Erro ao atualizar a máquina.', variant: 'danger' });
    }
  };

  const handleRemoveMachine = async (serial) => {
    try {
      await axios.post('http://10.5.8.145:5005/remove_maintence_machines', { serial });
      setAlert({ show: true, message: 'Máquina removida da manutenção com sucesso.', variant: 'success' });
      fetchMachinesUnderMaintenance();
    } catch (error) {
      setAlert({ show: true, message: 'Erro ao remover a máquina da manutenção.', variant: 'danger' });
    }
  };

  const handleShowMoveModal = (machine) => {
    setCurrentMachine(machine);
    setShowMoveModal(true);
  };

  const handleMoveMachine = async () => {
    try {
      const currentDate = new Date().toLocaleDateString('pt-BR');
      const updatedMachine = {
        ...currentMachine,
        obs: `Máquina retornou do conserto | Data de modificação: ${currentDate}`,
        status: 'Usada em bom estado'
      };

      let destinationSheet = '';
      // eslint-disable-next-line
      switch (moveDestination) {
        case 'backup':
          destinationSheet = 'Máquinas Backup';
          break;
        case 'itfacil':
          destinationSheet = 'Máquinas ITFacil';
          break;
        case 'ecom':
          destinationSheet = 'Máquinas ECOM';
          break;
      }

      await axios.post('http://10.5.8.145:5005/move_machine_to_backup', {
        serial: currentMachine.serial,
        destination_sheet: destinationSheet,
        machine: updatedMachine
      });

      setAlert({ show: true, message: 'Máquina movida com sucesso.', variant: 'success' });
      fetchMachinesUnderMaintenance();
      setShowMoveModal(false);
    } catch (error) {
      setAlert({ show: true, message: 'Erro ao mover a máquina.', variant: 'danger' });
    }
  };

  return (
    <div className="container mt-4 d-grid gap-2">
      <h2 className="text-center">Máquinas em Manutenção</h2>
      {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
      <Button variant="primary" size="lg" className="mb-5" onClick={handleShowAddModal}>
        Adicionar Máquina
      </Button>
      <div className='table-responsive text-center'>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Serial Number</th>
              <th>Hostname</th>
              <th>Modelo</th>
              <th>Defeito</th>
              <th>Status</th>
              <th>Empresa</th>
              <th>Observação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {machinesUnderMaintenance.map((machine) => (
              <tr key={machine.serial}>
                <td>{machine.serial}</td>
                <td>{machine.hostname}</td>
                <td>{machine.model}</td>
                <td>{machine.defeito}</td>
                <td>{machine.status}</td>
                <td>{machine.empresa}</td>
                <td>{machine.obs}</td>
                <td>
                  <Button
                    variant="warning"
                    className="m-1"
                    onClick={() => handleShowEditModal(machine)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveMachine(machine.serial)}
                  >
                    Remover
                  </Button>
                  {machine.status !== 'Pronto' && (
                    <Button
                      variant="success"
                      className="m-1"
                      onClick={() => handleShowMoveModal(machine)}
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
              <Form.Label>Empresa</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Descreva a empresa que a maquina atua"
                value={currentMachine.empresa}
                onChange={(e) => setCurrentMachine({ ...currentMachine, empresa: e.target.value })}
              />
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
                value={currentMachine.serial}
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
            <Form.Group className="mb-3">
              <Form.Label>Empresa</Form.Label>
              <Form.Control
                type="text"
                value={currentMachine.empresa}
                onChange={(e) => setCurrentMachine({ ...currentMachine, empresa: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Defeito</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentMachine.defeito}
                onChange={(e) => setCurrentMachine({ ...currentMachine, defeito: e.target.value })}
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
                value={currentMachine.obs}
                onChange={(e) => setCurrentMachine({ ...currentMachine, obs: e.target.value })}
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

      <Modal show={showMoveModal} onHide={() => setShowMoveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Mover Máquina</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Selecione o destino da máquina</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  name="moveDestination"
                  label="Máquinas Backup"
                  checked={moveDestination === 'backup'}
                  onChange={() => setMoveDestination('backup')}
                />
                <Form.Check
                  type="radio"
                  name="moveDestination"
                  label="Máquinas ITFacil"
                  checked={moveDestination === 'itfacil'}
                  onChange={() => setMoveDestination('itfacil')}
                />
                <Form.Check
                  type="radio"
                  name="moveDestination"
                  label="Máquinas ECOM"
                  checked={moveDestination === 'ecom'}
                  onChange={() => setMoveDestination('ecom')}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMoveModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleMoveMachine}
            disabled={!moveDestination}
          >
            Mover
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MaquinasEmManutencao;
