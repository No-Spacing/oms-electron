import apiClient from "../../services/axios";

export default class UserService {
    async getUsers () {
        const response = await apiClient.get('/users');
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