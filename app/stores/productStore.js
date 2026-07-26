export const useProductStore = defineStore('product', () => {
    const products = ref([]);
    const currentProduct = ref(null);

    const pagination = ref({
        total: 0,
        per_page: 10,
        current_page: 1,
        has_more_pages: false,
        has_pages: false
    });

    const getAllProducts = async (params = {}, force = false) => {
        const query = {}

        if (params.per_page) query.per_page = params.per_page;
        if (params.page !== undefined && params.page !== null) query.page = params.page;
        if (params.search) query.search = params.search;
        if (params.status) query.status = params.status;
        if (params.category_id) query.category_id = params.category_id;
        if (params.collection) query.collection = params.collection;
        if (params.column) query.column = params.column;
        if (params.sort) query.sort = typeof params.sort === 'string' ? params.sort.toLowerCase() : params.sort;
        if (params.min_price !== undefined && params.min_price !== null) query.min_price = params.min_price;
        if (params.max_price !== undefined && params.max_price !== null) query.max_price = params.max_price;
        if (params.brand) query.brand = params.brand;

        const isDefaultFetch = !params.search && (!params.page || params.page === 1) && !params.category_id && !params.brand && !params.collection;
        if (!force && isDefaultFetch && products.value.length > 0) {
            return { data: products.value, paginate: pagination.value };
        }

        const response = await $fetch('/api/products', { query });

        if (response?.data !== undefined) {
            products.value = response.data;
        }

        const pageData = response?.paginate;
        if (pageData) {
            pagination.value = pageData;
        }

        return response;
    }

    const getProductByUuid = async (uuid) => {
        console.log("getProductByUuid called with:", uuid);
        const response = await $fetch(`/api/products/${uuid}`);
        if (response?.data) {
            currentProduct.value = response.data;
        }
        return response;
    }

    const getFilteredProducts = async (params = {}) => {
        const query = {}

        if (params.per_page) query.per_page = params.per_page;
        if (params.page !== undefined && params.page !== null) query.page = params.page;
        if (params.search) query.search = params.search;
        if (params.status) query.status = params.status;
        if (params.category_id) query.category_id = params.category_id;
        if (params.collection) query.collection = params.collection;
        if (params.column) query.column = params.column;
        if (params.sort) query.sort = typeof params.sort === 'string' ? params.sort.toLowerCase() : params.sort;
        if (params.min_price !== undefined && params.min_price !== null) query.min_price = params.min_price;
        if (params.max_price !== undefined && params.max_price !== null) query.max_price = params.max_price;
        if (params.brand) query.brand = params.brand;

        return await $fetch('/api/products', { query });
    }

    const getBestSellers = async (params = {}) => {
        return await getFilteredProducts({ ...params, collection: 'best_seller' });
    }

    const getPopular = async (params = {}) => {
        return await getFilteredProducts({ ...params, collection: 'popular' });
    }

    const getTrending = async (params = {}) => {
        return await getFilteredProducts({ ...params, collection: 'popular' });
    }

    const getNewArrivals = async (params = {}) => {
        return await getFilteredProducts({ ...params, collection: 'new_arrival' });
    }

    const getDiscounts = async (params = {}) => {
        return await getFilteredProducts(params);
    }

    const brandsList = ref([]);

    const getBrands = async (params = {}, force = false) => {
        if (!force && brandsList.value.length > 0 && (!params || Object.keys(params).length === 0)) {
            return brandsList.value;
        }
        const response = await $fetch('/api/brands', { query: params });
        if (response?.data) {
            brandsList.value = response.data;
        }
        return response?.data || [];
    }

    return {
        products,
        currentProduct,
        pagination,
        getAllProducts,
        getFilteredProducts,
        getBestSellers,
        getPopular,
        getTrending,
        getNewArrivals,
        getDiscounts,
        getProductByUuid,
        getBrands
    }
});