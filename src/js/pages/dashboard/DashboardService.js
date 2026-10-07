import apiClient from "../../services/axios";

export default class DashboardService {
    async getData() {
        const response = await apiClient.get('/dashboard/get-data');
        return response.data;
    }

    async getOrderStats() {
        const response = await apiClient.get('/dashboard/get-record-stats');
        return response.data;
    }
}