import apiClient from "../../services/axios";

export default class UserService {
    async getUsers (params) {
        const response = await apiClient.get('/users', { params });
        return response.data;
    }

    async saveUser(data) {
        const response = await apiClient.post('/users/save-user', data);
        return response.data;
    }

    async deleteUser(data) {
        const response = await apiClient.post('/users/delete-user', data);
        return response.data;
    }

    async getRoles() {
        const response = await apiClient.get('/roles');
        return response.data
    }
}