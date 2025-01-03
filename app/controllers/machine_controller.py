from flask import jsonify, request
from app.models.machine import Machine
from app.services.google_sheets_service import GoogleSheetsService
from app.services.machine_services import MachineService
from app.services.machine_services import AuthService

class MachineController:
    def __init__(self):
        self.google_sheets_service = GoogleSheetsService()
        self.auth_service = AuthService()
        self.machine_service = MachineService(self.google_sheets_service, self.auth_service)

    def update_machines(self):
        self.machine_service.fetch_external_machines()

    def test_google_sheets_connection(self):
        data = self.google_sheets_service.get_all_machines()
        return jsonify(data), 200

    def get_machines(self):
        machines = self.google_sheets_service.get_all_machines()
        return jsonify(machines), 200

    def add_machine(self):
        data = request.json
        machine = Machine(id=data['id'], name=data['name'])
        self.google_sheets_service.add_machines(machine.to_dict())
        return jsonify({"message": "row add"}), 201

    def get_backup_machines(self):
        """Recupera as máquinas da aba 'Máquinas Backup'."""
        backup_machines = self.google_sheets_service.get_backup_machines()
        return jsonify(backup_machines), 200

    def edit_backup_machine(self):
        try:
            data = request.json
            print(f"Payload recebido: {data}")

            machine = Machine(
                id=data.get('serialNumber'),  # Certifique-se de que o ID esteja correto no payload
                name=data.get('hostname'),  # Status com valor padrão
                status=data.get('status'),
                model=data.get('modelo'),
                equipamento=None,
                obs=data.get('observacoes'),
                empresa=None
            )

            self.google_sheets_service.edit_backup_machine(machine.to_dict())
            return jsonify({"message": "Máquina atualizada"}), 200
        except Exception as e:
            print(f"Erro ao editar máquina: {e}")
            return jsonify({"error": str(e)}), 500

    def add_backup_machine(self):
        """Adiciona uma nova máquina à aba 'Máquinas Backup'."""
        try:
            data = request.json
            print(data)
            machine = Machine(id=data['serialNumber'], name=data['hostname'], model=data['model'], equipamento=None, status=data['status'], empresa=None, obs=data['observation'])
            self.google_sheets_service.add_backup_machine(machine.to_dict())
            return jsonify({"message": "Backup row added"}), 201
        except Exception as e:
            print(f"Erro ao adicionar máquina: {e}")
            return jsonify({"error": str(e)}), 500

    def remove_backup_machine(self):
        """Remove uma máquina da aba 'Máquinas Backup'."""
        data = request.json
        print(data)
        self.google_sheets_service.remove_backup_machine(data['serialNumber'])
        return jsonify({"message": "Backup row removed"}), 200

    def get_itfacil_machines(self):
        """Recupera as máquinas da aba 'Máquinas Backup'."""
        itfacil_machines = self.google_sheets_service.get_itfacil_machines()
        return jsonify(itfacil_machines), 200

    def edit_itfacil_machine(self):
        try:
            data = request.json
            print(f"Payload recebido: {data}")

            machine = Machine(
                id=data.get('serialNumber'),  # Certifique-se de que o ID esteja correto no payload
                name=data.get('name'),  # Status com valor padrão
                status=data.get('status'),
                model=data.get('modelo'),
                equipamento=data.get('equipamento'),
                obs=data.get('observacoes'),
                empresa=data.get('empresa')
            )

            self.google_sheets_service.edit_itfacil_machine(machine.to_dict())
            return jsonify({"message": "Máquina atualizada"}), 200
        except Exception as e:
            print(f"Erro ao editar máquina: {e}")
            return jsonify({"error": str(e)}), 500

    def add_itfacil_machine(self):
        """Adiciona uma nova máquina à aba 'Máquinas itfacil'."""
        try:
            data = request.json
            print(data)
            machine = Machine(id=data['serialNumber'], name=data['hostname'], model=data['model'], equipamento=data['equipamento'], status=data['status'], obs=data['observation'], empresa=data['empresa'])
            self.google_sheets_service.add_itfacil_machine(machine.to_dict())
            return jsonify({"message": "itfacil row added"}), 201
        except Exception as e:
            print(f"Erro ao adicionar máquina: {e}")
            return jsonify({"error": str(e)}), 500

    def remove_itfacil_machine(self):
        """Remove uma máquina da aba 'Máquinas itfacil'."""
        data = request.json
        print(data)
        self.google_sheets_service.remove_itfacil_machine(data['serialNumber'])
        return jsonify({"message": "itfacil row removed"}), 200

    def get_maintence_machines(self):
        """Recupera as máquinas da aba 'Máquinas Manutenção'."""
        maintence_machines = self.google_sheets_service.get_maintence_machines()
        return jsonify(maintence_machines), 200

    def edit_maintence_machine(self):
        try:
            data = request.json
            print(f"Payload recebido: {data}")

            machine = Machine(
                id=data.get('serial'),
                name=data.get('hostname'),
                status=data.get('status'),
                model=data.get('model'),
                equipamento=data.get('defeito'), # SOMENTE NESTE CENARIO ESTE EQUIPAMENTO É TRATADO COMO O ESPAÇO DE "DEFEITO"
                obs=data.get('obs'),
                empresa=data.get('empresa')
            )

            self.google_sheets_service.edit_maintence_machine(machine.to_dict())
            return jsonify({"message": "Máquina atualizada"}), 200
        except Exception as e:
            print(f"Erro ao editar máquina: {e}")
            return jsonify({"error": str(e)}), 500

    def add_maintence_machine(self):
        """Adiciona uma nova máquina à aba 'Máquinas Manutenção'."""
        try:
            data = request.json
            print("data: ", data)  # SOMENTE NESTE CENARIO ESTE EQUIPAMENTO É TRATADO COMO O ESPAÇO DE "DEFEITO"
            machine = Machine(id=data['serialNumber'], name=data['hostname'], model=data['model'], equipamento=data.get('defect'), status=data['status'], obs=data['observation'], empresa=data['empresa'])
            self.google_sheets_service.add_maintence_machine(machine.to_dict())
            return jsonify({"message": "maintence row added"}), 201
        except Exception as e:
            print(f"Erro ao adicionar máquina: {e}")
            return jsonify({"error": str(e)}), 500

    def remove_maintence_machine(self):
        """Remove uma máquina da aba 'Máquinas Manutenção'."""
        data = request.json
        print(data)  # SOMENTE NESTE CENARIO ESTE EQUIPAMENTO É TRATADO COMO O ESPAÇO DE "DEFEITO"
        self.google_sheets_service.remove_maintence_machine(data['serial'])
        return jsonify({"message": "maintence row removed"}), 200

    def move_machine_to_backup(self):
        try:
            data = request.json
            machine_id = data.get('serial')
            destination = data.get('destination_sheet').lower().split(' ')[1]
            machine_data = data.get('machine')

            result = self.google_sheets_service.move_machine(machine_id, destination, machine_data)
            return jsonify({"message": result}), 200
        except Exception as e:
            print(f"Erro ao mover máquina: {e}")
            return jsonify({"error": str(e)}), 500