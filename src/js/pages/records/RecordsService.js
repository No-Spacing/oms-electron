import apiClient from "../../services/axios";

export default class RecordsService {
    async getRecords(params) {
        const response = await apiClient.get('/records', {params});
    }
}