import gspread
from google.oauth2.service_account import Credentials
from config import Config
import time

class GoogleSheetsService:
    def __init__(self):
        scopes = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
        self.creds = Credentials.from_service_account_file(Config.GOOGLE_SHEETS_CREDENTIALS_FILE, scopes=scopes)
        self.client = gspread.authorize(self.creds)
        self.sheet = self.client.open_by_key(Config.GOOGLE_SHEET_ID).sheet1

    def get_all_machines(self):
        """Recupera todos os registros da planilha."""
        return self.sheet.get_all_records()

    def add_machines(self, machines, max_retries=10, delay=10):
        """Adiciona os dispositivos enriquecidos à planilha Google Sheets, com re-tentativas."""
        try:
            values = []
            for machine in machines:
                if isinstance(machine, dict):
                    values.append([
                        machine.get("hostname", ""),
                        machine.get("lastLoggedInUser", ""),
                        machine.get("operatingSystem", ""),
                        machine.get("siteName", ""),
                        machine.get("deviceType",),
                        machine.get("model"),
                        machine.get("manufacturer"),
                        machine.get("serialNumber", ""),
                        machine.get("udf3", ""),
                        machine.get("domain", ""),
                        machine.get("udf9",  ""),
                    ])

            # Adiciona as linhas à planilha com re-tentativas
            for value in values:
                retries = 0
                while retries < max_retries:
                    try:
                        self.sheet.append_row(value)
                        break  # Sai do loop se a operação for bem-sucedida
                    except Exception as e:
                        if "Quota exceeded" in str(e):
                            retries += 1
                            print(f"Quota excedida, aguardando {delay} segundos... (Tentativa {retries}/{max_retries})")
                            time.sleep(delay)
                        else:
                            raise  # Re-levanta exceções que não estão relacionadas à cota
                else:
                    print(f"Falha ao adicionar a linha após {max_retries} tentativas: {value}")

            print(f"{len(values)} linhas adicionadas à planilha.")

        except Exception as e:
            print(f"Erro ao atualizar a planilha: {e}")

    def _format_machine_row(self, machine):
        """Formata os dados de uma máquina para inserção ou atualização na planilha."""
        return [
            machine.get("hostname", ""),
            machine.get("lastLoggedInUser", ""),
            machine.get("operatingSystem", ""),
            machine.get("siteName", ""),
            machine.get("deviceType", ),
            machine.get("model"),
            machine.get("manufacturer"),
            machine.get("serialNumber", ""),
            machine.get("udf3", ""),
            machine.get("domain", ""),
            machine.get("udf9", ""),
        ]

    def get_backup_machines(self):
        """Recupera todas as máquinas da aba 'Máquinas Backup'."""
        sheet = self.client.open_by_key(Config.GOOGLE_SHEET_ID).worksheet('Máquinas Backup')
        return sheet.get_all_records()

    def add_backup_machine(self, machine):
        """Adiciona uma nova máquina à aba 'Máquinas Backup'."""
        try:
            sheet = self.client.open_by_key(Config.GOOGLE_SHEET_ID).worksheet('Máquinas Backup')
            print(machine)
            sheet.append_row([machine['name'], machine['id'], machine['model'], machine['status'], machine['obs']])
        except Exception as e:
            print(f"erro: {e}")

    def remove_backup_machine(self, machine_id):
        """Remove uma máquina pelo ID na aba 'Máquinas Backup'."""
        sheet = self.client.open_by_key(Config.GOOGLE_SHEET_ID).worksheet('Máquinas Backup')
        all_records = sheet.get_all_records()
        for index, record in enumerate(all_records, start=2):
            if record.get('serialNumber') == machine_id:  # Verifica pelo 'id'
                sheet.delete_rows(index)
                break

    def edit_backup_machine(self, machine):
        """Edita os dados de uma máquina existente na aba 'Máquinas Backup', exceto o serialNumber."""
        try:
            sheet = self.client.open_by_key(Config.GOOGLE_SHEET_ID).worksheet('Máquinas Backup')
            all_records = sheet.get_all_records()
            for index, record in enumerate(all_records, start=2):
                if record.get('serialNumber') == machine['id']:
                    sheet.update(f"A{index}:E{index}", [[
                        machine['name'], record.get('serialNumber'), machine['model'], machine['status'], machine['obs']
                    ]])
                    print(f"Máquina com serialNumber {machine['id']} atualizada com sucesso.")
                    return
            print("Máquina com serialNumber não encontrada para edição.")
        except Exception as e:
            print(f"Erro ao editar máquina: {e}")

