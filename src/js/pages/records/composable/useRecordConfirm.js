import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import RecordService from '../RecordService';

export function useRecordConfirm() {
    const confirm = useConfirm();
    const toast = useToast();
    const recordService = new RecordService();

    const triggerConfirm = (params, form, route, onSuccess, onError) => {
        confirm.require({
            message: 'Do you want to notify the customer?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            rejectProps: {
                label: 'No',
                severity: 'danger',
                outlined: true
            },
            acceptProps: {
                label: 'Yes'
            },
            accept: async () => {
                // Your accept logic here...
                toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Message sent.', life: 3000 });
                if (onSuccess) onSuccess();
            },
            reject: async () => {
                // Your reject logic here...
                toast.add({ severity: 'error', summary: 'Rejected', detail: 'Message not sent', life: 3000 });
                if (onError) onError();
            }
        });
    };

    return { triggerConfirm };
}