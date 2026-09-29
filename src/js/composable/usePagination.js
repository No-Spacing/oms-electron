import { ref } from 'vue';

export function usePagination(fetchFunction, initialRows = 10) {
    const data = ref({ data: [], meta: { total: 0 } });
    const first = ref(0);
    const rows = ref(initialRows);
    const loading = ref(false);
    const search = ref('');

    const loadData = async (page = 1, perPage = rows.value, searchQuery = search.value) => {
        loading.value = true;
        try {
            data.value = await fetchFunction({
                page: page,
                per_page: perPage,
                search: searchQuery
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
        loadData(targetPage, rows.value, search.value);
    };

    const onSearch = (event) => {
        // Usually, when searching, you want to reset back to the first page (0)
        first.value = 0; 
        rows.value = event.rows || rows.value;
        search.value = event.search;

        loadData(1, rows.value, search.value);
    };

    // Initial load helper
    const init = () => loadData(1, rows.value, search.value);

    return {
        data,
        first,
        rows,
        loading,
        search,
        onPageChange,
        onSearch,
        loadData,
        init
    };
}