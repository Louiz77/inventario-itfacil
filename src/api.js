import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.5.9.45:5000', //flask
});

export const fetchMachines = () => api.get('/machines');
export const addMachine = (data) => api.post('/add_machine', data);
export const removeMachine = (id) => api.post('/remove_machine', { id });
export const editMachine = (data) => api.post('/edit_machine', data);

export default api;