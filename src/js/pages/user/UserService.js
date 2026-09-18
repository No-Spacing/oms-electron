import apiClient from "../../services/axios";

export default class UserService {
    async getUsers () {
        const response = await apiClient.get('/users');
        return response.data;
    }
}