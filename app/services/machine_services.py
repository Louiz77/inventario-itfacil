import requests
import time
import os
from dotenv import load_dotenv

# Carregar as variáveis do .env
load_dotenv()

class MachineService:
    def __init__(self, google_sheets_service, auth_service):
        self.google_sheets_service = google_sheets_service
        self.auth_service = auth_service

    def _get_authorization_header(self):
        """Obtém o token atualizado e retorna o cabeçalho de autorização."""
        token = self.auth_service.get_access_token()
        return {'Authorization': f'Bearer {token}', 'accept': '*/*'}

    def get_device_details(self, uid):
        """Faz uma requisição para obter os detalhes do dispositivo com base no UID."""
        url = f"https://vidal-api.centrastage.net/api/v2/audit/device/{uid}"
        headers = self._get_authorization_header()
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            response.raise_for_status()

    def fetch_external_machines(self):
        """Busca os dispositivos, enriquece com detalhes adicionais e envia para a planilha."""
        url = "https://vidal-api.centrastage.net/api/v2/site/d3a60d3a-2436-4153-ad75-2b4f7b7e7000/devices"
        headers = self._get_authorization_header()
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            devices = response.json().get("devices", [])
            enriched_devices = []

            try:
                for device in devices:
                    uid = device['uid']
                    details = self.get_device_details(uid)

                    # Enriquecer os dados do dispositivo
                    enriched_device = {
                        'hostname': device.get('hostname'),
                        'lastLoggedInUser': device.get('lastLoggedInUser'),
                        'manufacturer': details.get('systemInfo', {}).get('manufacturer', 'N/A'),
                        'model': details.get('systemInfo', {}).get('model', 'N/A'),
                        'operatingSystem': device.get('operatingSystem'),
                        'siteName': device.get('siteName'),
                        'deviceType': device.get('deviceType', {}).get('category'),
                        'serialNumber': details.get('bios', {}).get('serialNumber', 'N/A'),
                        'udf9': device.get("udf", {}).get("udf9", ""),
                        'udf3': device.get("udf", {}).get("udf3", ""),
                        'domain': device.get("domain", ""),
                    }
                    enriched_devices.append(enriched_device)

                # Adiciona os dispositivos enriquecidos à planilha
                self.google_sheets_service.add_machines(enriched_devices)
                return enriched_devices

            except Exception as e:
                print(f"Erro ao processar dispositivos: {e}")
        else:
            response.raise_for_status()


class AuthService:
    def __init__(self):
        self.api_url = os.getenv('API_URL')
        self.client_id = os.getenv('CLIENT_ID')
        self.client_secret = os.getenv('CLIENT_SECRET')
        self.username = os.getenv('API_KEY')
        self.password = os.getenv('API_SECRET_KEY')
        self.access_token = None
        self.token_expiry = 0

    def get_access_token(self):
        """Obtém um token válido, renovando se necessário."""
        if time.time() >= self.token_expiry:
            self._fetch_access_token()
        return self.access_token

    def _fetch_access_token(self):
        """Obtém o access token utilizando o fluxo 'password grant'."""
        url = f"{self.api_url}/auth/oauth/token"
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        data = {
            "grant_type": "password",
            "username": self.username,
            "password": self.password,
        }
        response = requests.post(
            url,
            headers=headers,
            data=data,
            auth=(self.client_id, self.client_secret)  # Autenticação com client_id e client_secret
        )
        if response.status_code == 200:
            token_data = response.json()
            self.access_token = token_data["access_token"]
            self.token_expiry = time.time() + token_data.get("expires_in", 3600)
        else:
            raise Exception(
                f"Erro ao renovar o token: {response.status_code}, {response.text}"
            )
