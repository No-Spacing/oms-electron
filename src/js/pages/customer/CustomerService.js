import apiClient from "../../services/axios";

export default class CustomerService {
    async getCustomers(params) {
        const response = await apiClient.get('/customer', {params});
        return response.data;
    }

    async getCustomer(data) {
        const response = await apiClient.get(`/customer/${data}`);
        return response.data
    }

    async saveCustomer(data) {
        const response = await apiClient.post('/customer/save-customer', data);
        return response.data;
    }

    async deleteCustomer(data) {
        const response = await apiClient.post('/customer/delete-customer');
        return response.data;
    }

    async getCompanies () {
        const response = await apiClient.get('/customer/companies');
        return response.data;
    }
}