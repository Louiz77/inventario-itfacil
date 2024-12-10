class Machine:
    def __init__(self, id, name, model, status, obs):
        self.id = id
        self.name = name
        self.model = model
        self.status = status
        self.obs = obs

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'model': self.model, 'status': self.status, 'obs': self.obs}