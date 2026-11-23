import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8080/api' })

export const getStudents = () => api.get('/students').then(r => r.data)
export const createStudent = data => api.post('/students', data).then(r => r.data)
export const updateStudent = (id, data) => api.put(`/students/${id}`, data).then(r => r.data)
export const deleteStudent = id => api.delete(`/students/${id}`)
