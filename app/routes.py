from flask import Blueprint, jsonify
from app.controllers.machine_controller import MachineController

controller = MachineController()
routes = Blueprint('routes', __name__)

def setup_routes(app):
    app.register_blueprint(routes)

@routes.route('/update-machines', methods=['GET'])
def update_machines():
    print("Requisição | AtualizarMaquinas(DefenderAPI)")
    try:
        controller.update_machines()
        return jsonify({"message": "API DEFENDER - Informacoes atualizadas"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@routes.route('/machines', methods=['GET'])
def get_machines():
    print("Requisição | ListarMaquinas")
    return controller.get_machines()

@routes.route('/add_machine', methods=['POST'])
def add_machine():
    print("Requisição | AdicionarMaquinas")
    return controller.add_machine()

@routes.route('/test_google_sheets', methods=['GET'])
def test_google_sheets():
    return controller.test_google_sheets_connection()

@routes.route('/backup_machines', methods=['GET'])
def get_backup_machines():
    try:
        print("Requisição | ListarMáquinasBackup")
        return controller.get_backup_machines()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@routes.route('/add_backup_machine', methods=['POST'])
def add_backup_machine():
    try:
        print("Requisição | AdicionarMáquinaBackup")
        return controller.add_backup_machine()
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@routes.route('/remove_backup_machine', methods=['POST'])
def remove_backup_machine():
    print("Requisição | RemoverMáquinaBackup")
    return controller.remove_backup_machine()

@routes.route('/edit_backup_machine', methods=['POST'])
def edit_backup_machine():
    try:
        print("Requisição | EditarMáquinaBackup")
        return controller.edit_backup_machine()
    except Exception as e:
        return jsonify({"error": str(e)}), 500