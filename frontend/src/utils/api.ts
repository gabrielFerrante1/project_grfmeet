import axios, { Axios, AxiosError, AxiosPromise } from "axios";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

export const api = async <TypeDataResponse>(
    route: string,
    method: 'get' | 'post' | 'put' | 'delete' = 'get',
    data?: object | string,
    token: string | null = null
) => {

    var header = {};
    let body = null;
    let fullUrl = `${base_url}/${route}`;

    if (token) {
        header = { Authorization: `Bearer ${token}` }
    }


    switch (method) {
        case 'get':
            if (data != undefined) {
                if (typeof data == 'string') {
                    let queryString = new URLSearchParams(data).toString();
                    fullUrl += `?${queryString}`;
                }
            }
            break;
        case 'post':
        case 'put':
        case 'delete':
            body = data;
            break;
    }

    try {
        const request = await axios<TypeDataResponse>({
            url: fullUrl,
            method,
            data: body,
            headers: header
        })

        return {
            data: request.data
        }
    } catch (e) {
        const error = e as AxiosError

        return {
            data: error.response?.data as TypeDataResponse
        }
    }
} 