import apiClient from "../../services/axios";

export default class CompanyService {
    async getCompanies(params) {
        const response = await apiClient.get('/company', { params });
        return response.data;
    }

    async getCompany(id, params) {
        const response = await apiClient.get(`/company/view-company/${id}`, { params });
        return response.data
    }

    async saveCompany(data) {
        const response = await apiClient.post('/company/save-company', data);
        return response.data;
    }

    async saveCustomer(data) {
        const response = await apiClient.post('/company/save-customer', data);
        return response.data;
    }

    async deleteCompany(data) {
        const response = await apiClient.post('/company/delete-company', data);
        return response.data
    }
}