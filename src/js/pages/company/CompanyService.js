import apiClient from "../../services/axios";

export default class CompanySerive {
    async getCompanies() {
        const response = await apiClient.get('/company');
        return response.data;
    }

    async save(data) {
        const response = await apiClient.post('/company/save-company', data);
        return response.data;
    }
}