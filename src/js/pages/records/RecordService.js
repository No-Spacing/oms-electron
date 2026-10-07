import apiClient from "../../services/axios";

export default class RecordService {
    async getRecords(params) {
        const response = await apiClient.get('/record', {params});
        return response.data
    }

    async saveRecord(params) {
        const response = await apiClient.post('/record/save-record', {
            customer_id: params.customer.id,
            order_no: params.order_no,
            order_amount: params.order_amount,
        });

        return response.data
    }

    async getRecord(data) {
        const response = await apiClient.get(`/record/${data}`);
        return response.data;
    }

    async updateStatus(params) {
        const response = await apiClient.post('/record/update-status', {
            params
        });
        return response.data;
    }
}