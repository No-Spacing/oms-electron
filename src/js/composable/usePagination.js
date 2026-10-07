import { ref } from 'vue';

export function usePagination(fetchFunction, initialRows = 10, initialFilters = null) {
    const data = ref({ data: [], meta: { total: 0 } });
    const first = ref(0);
    const rows = ref(initialRows);
    const loading = ref(false);
    const search = ref('');
    
    // Filters are optional: if not provided, it starts empty
    const filters = ref(initialFilters ? { ...initialFilters } : {});
    const hasInitialFilters = initialFilters !== null && initialFilters !== undefined;

    const loadData = async (page = 1, perPage = rows.value, searchQuery = search.value, filterQuery = filters.value) => {
        loading.value = true;
        try {
            // Build the payload dynamically
            const payload = {
                page: page,
                per_page: perPage,
                search: searchQuery
            };

            // Only include 'filters' if the page explicitly uses them or user applied them
            if (hasInitialFilters || Object.keys(filterQuery).length > 0) {
                payload.filters = filterQuery;
            }

            data.value = await fetchFunction(payload);
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
        loadData(targetPage, rows.value, search.value, filters.value);
    };

    const onSearch = (event) => {
        first.value = 0; 
        rows.value = event.rows || rows.value;
        search.value = typeof event === 'string' ? event : event.search;

        loadData(1, rows.value, search.value, filters.value);
    };

    const onFilter = (newFilters) => {
        first.value = 0;
        filters.value = { ...filters.value, ...newFilters };
        loadData(1, rows.value, search.value, filters.value);
    };

    const setFilter = (key, value) => {
        first.value = 0;
        filters.value[key] = value;
        loadData(1, rows.value, search.value, filters.value);
    };

    const resetFilters = () => {
        first.value = 0;
        filters.value = initialFilters ? { ...initialFilters } : {};
        search.value = '';
        loadData(1, rows.value, search.value, filters.value);
    };

    // Initial load helper
    const init = () => loadData(1, rows.value, search.value, filters.value);

    return {
        data,
        first,
        rows,
        loading,
        search,
        filters,
        onPageChange,
        onSearch,
        onFilter,
        setFilter,
        resetFilters,
        loadData,
        init
    };
}