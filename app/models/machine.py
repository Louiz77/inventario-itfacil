class Machine:
    def __init__(self, id, name, model, equipamento, status, obs):
        self.id = id
        self.name = name
        self.model = model
        self.equipamento = equipamento
        self.status = status
        self.obs = obs


    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'model': self.model, 'equipamento': self.equipamento, 'status': self.status, 'obs': self.obs}