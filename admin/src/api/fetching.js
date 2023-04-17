/* global wpApiSettings */
export async function getData(slug) {
    try {
        const result = await fetch(wpApiSettings.root + `urlslab/v1${slug ? `/${slug}` : ''}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
                'X-WP-Nonce': window.wpApiSettings.nonce,
            },
            credentials: 'include',
        });
        if (result.ok) {
            return await result.json();
        }
        return undefined;
    } catch (error) {
        return false;
    }
}

export async function fetchTableData(slug, filter_columns = [], sorting_columns = [], perPage = 150) {
    try {
        const body_object = {sorting: [], filters: []};
        if ('undefined' === typeof filter_columns) {
            body_object.filters = filter_columns;
        }
        if ('undefined' === typeof sorting_columns) {
            body_object.sorting = sorting_columns;
        }
        body_object.rows_per_page = perPage;

        const result = await fetch(wpApiSettings.root + `urlslab/v1` + ( slug ? ( `/` + slug ) : '' ), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
                'X-WP-Nonce': window.wpApiSettings.nonce,
            },
            credentials: 'include',
            body: JSON.stringify( body_object ),
        });
        if ( result.ok ) {
            return await result.json();
        }
        return undefined;
    } catch ( error ) {
        return false;
    }
}


export async function setModule(slug, object) {
    try {
        const result = await fetch(wpApiSettings.root + `urlslab/v1/module/${slug}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
                'X-WP-Nonce': window.wpApiSettings.nonce,
            },
            credentials: 'include',
            body: JSON.stringify(object),
        });
        return result;
    } catch (error) {
        return false;
    }
}

export async function setData(slug, object) {
    try {
        const result = await fetch(wpApiSettings.root + `urlslab/v1/${slug}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
                'X-WP-Nonce': window.wpApiSettings.nonce,
            },
            credentials: 'include',
            body: JSON.stringify(object),
        });
        return result;
    } catch (error) {
        return false;
    }
}
