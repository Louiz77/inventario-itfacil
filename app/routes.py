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

@routes.route('/itfacil_machines', methods=['GET'])
def get_itfacil_machines():
    try:
        print("Requisição | ListarMáquinasitfacil")
        return controller.get_itfacil_machines()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@routes.route('/add_itfacil_machine', methods=['POST'])
def add_itfacil_machine():
    try:
        print("Requisição | AdicionarMáquinaitfacil")
        return controller.add_itfacil_machine()
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@routes.route('/remove_itfacil_machine', methods=['POST'])
def remove_itfacil_machine():
    print("Requisição | RemoverMáquinaitfacil")
    return controller.remove_itfacil_machine()

@routes.route('/edit_itfacil_machine', methods=['POST'])
def edit_itfacil_machine():
    try:
        print("Requisição | EditarMáquinaitfacil")
        return controller.edit_itfacil_machine()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@routes.route('/maintence_machines', methods=['GET'])
def get_maintence_machines():
    try:
        print("Requisição | ListarMáquinasManutencao")
        return controller.get_maintence_machines()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@routes.route('/add_maintence_machines', methods=['POST'])
def add_maintencemachine():
    try:
        print("Requisição | AdicionarMáquinaManutencao")
        return controller.add_maintence_machine()
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@routes.route('/remove_maintence_machines', methods=['POST'])
def remove_maintencemachine():
    print("Requisição | RemoverMáquinaManutencao")
    return controller.remove_maintence_machine()

@routes.route('/edit_maintence_machines', methods=['POST'])
def edit_maintence_machine():
    try:
        print("Requisição | EditarMáquinaManutencao")
        return controller.edit_maintence_machine()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@routes.route('/move_machine_to_backup', methods=['POST'])
def move_machine_to_backup():
    print("Requisição | AtualizarStatusManutencao")
    return controller.move_machine_to_backup()