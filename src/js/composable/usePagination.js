import { ref } from 'vue';

export function usePagination(fetchFunction, initialRows = 10) {
    const data = ref({ data: [], meta: { total: 0 } });
    const first = ref(0);
    const rows = ref(initialRows);
    const loading = ref(false);

    const loadData = async (page = 1, perPage = rows.value) => {
        loading.value = true;
        try {
            // Passes page and per_page (Laravel friendly)
            data.value = await fetchFunction({
                page: page,
                per_page: perPage
            });
        } catch (error) {
            console.error('Pagination fetch error:', error);
        } finally {
            loading.value = false;
        }
    };

    const onPageChange = (event) => {
        first.value = event.first;
        rows.value = event.rows;
        
        // PrimeVue is 0-indexed, Laravel is 1-indexed
        const targetPage = event.page + 1;
        loadData(targetPage, event.rows);
    };

    // Initial load helper
    const init = () => loadData(1, rows.value);

    return {
        data,
        first,
        rows,
        loading,
        onPageChange,
        loadData,
        init
    };
}