import requests


class MachineService:
    def __init__(self, google_sheets_service):
        self.google_sheets_service = google_sheets_service

    def get_device_details(self, uid):
        """Faz uma requisição para obter os detalhes do dispositivo com base no UID."""
        url = f"https://vidal-api.centrastage.net/api/v2/audit/device/{uid}"
        headers = {
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiYWVtLWFwaSJdLCJ1c2VyX25hbWUiOiJyb25uYW4ubGluZGhAaXRmYWNpbHNlcnZpY29zLmNvbS5iciIsInNjb3BlIjpbImRhZmF1bHQiXSwiY2xpZW50QXV0aG9yaXRpZXMiOltdLCJhY2NvdW50X3VpZCI6InZpZGJkZmIwMDAxIiwiZXhwIjoxNzMzNTExNTc3LCJpYXQiOjE3MzMxNTE1NzcsImF1dGhvcml0aWVzIjpbIkFVVE9UQVNLX0FFTV9VU0VSIl0sImp0aSI6InlhLUJTeUpkUkgwdGpRZzFCSldwQnlTRUJKWSIsImNsaWVudF9pZCI6InB1YmxpYy1jbGllbnQifQ.GVTs_Q-4N-1EH3NBnR1NoY0NYgfJ919ueAxgxE0erRH2IMPUCAA8R6pZTPrbQs9bd_0R9wwWnx92GeRAnumpDmhgBaIbBiuIEuhTtJUie45l-8LubOVCO8tIlY33Li5WPchl3dtVkNMElhOyR74fYVnj116taniDH_ysP-asu7w8nBBDcMTvw7RzZedfBOOtwkJ_PYtx9JhZIddvshyTDjEmbajV8kD79E-F3pYM9-DRCU_r9rCZkF3G772W3Nugi27zq2FZVQLdSQO0L7kNjH5So7194sMAUuc0KIjEdWWK5MefGcTGTcUmTRb6nUZ1p1B-rbdlENha5o3FIbDksg',
            'accept': '*/*'
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            response.raise_for_status()

    def fetch_external_machines(self):
        """Busca os dispositivos, enriquece com detalhes adicionais e envia para a planilha."""
        url = "https://vidal-api.centrastage.net/api/v2/site/d3a60d3a-2436-4153-ad75-2b4f7b7e7000/devices"
        headers = {
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiYWVtLWFwaSJdLCJ1c2VyX25hbWUiOiJyb25uYW4ubGluZGhAaXRmYWNpbHNlcnZpY29zLmNvbS5iciIsInNjb3BlIjpbImRhZmF1bHQiXSwiY2xpZW50QXV0aG9yaXRpZXMiOltdLCJhY2NvdW50X3VpZCI6InZpZGJkZmIwMDAxIiwiZXhwIjoxNzMzNTExNTc3LCJpYXQiOjE3MzMxNTE1NzcsImF1dGhvcml0aWVzIjpbIkFVVE9UQVNLX0FFTV9VU0VSIl0sImp0aSI6InlhLUJTeUpkUkgwdGpRZzFCSldwQnlTRUJKWSIsImNsaWVudF9pZCI6InB1YmxpYy1jbGllbnQifQ.GVTs_Q-4N-1EH3NBnR1NoY0NYgfJ919ueAxgxE0erRH2IMPUCAA8R6pZTPrbQs9bd_0R9wwWnx92GeRAnumpDmhgBaIbBiuIEuhTtJUie45l-8LubOVCO8tIlY33Li5WPchl3dtVkNMElhOyR74fYVnj116taniDH_ysP-asu7w8nBBDcMTvw7RzZedfBOOtwkJ_PYtx9JhZIddvshyTDjEmbajV8kD79E-F3pYM9-DRCU_r9rCZkF3G772W3Nugi27zq2FZVQLdSQO0L7kNjH5So7194sMAUuc0KIjEdWWK5MefGcTGTcUmTRb6nUZ1p1B-rbdlENha5o3FIbDksg',
            'accept': '*/*'
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            devices = response.json().get("devices", [])

            enriched_devices = []  # Lista para armazenar dispositivos enriquecidos

            try:
                for device in devices:
                    uid = device['uid']
                    details = self.get_device_details(uid)

                    # Extrai o serialNumber
                    serial_number = details.get('bios', {}).get('serialNumber', 'N/A')
                    manufacturer = details.get('systemInfo', {}).get('manufacturer', 'N/A')
                    model = details.get('systemInfo', {}).get('model', 'N/A')

                    # Enriquecer os dados do dispositivo
                    enriched_device = {
                        'hostname': device.get('hostname'),
                        'lastLoggedInUser': device.get('lastLoggedInUser'),
                        'manufacturer': manufacturer,
                        'model': model,
                        'operatingSystem': device.get('operatingSystem'),
                        'siteName': device.get('siteName'),
                        'deviceType': device.get('deviceType', {}).get('category'),
                        'serialNumber': serial_number,
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
