export const DUMMY_API_BASE = "https://dummyjson.com";
export const API_BASE = "https://dummyjson.com";
export const apiRequest = async (url: string, options?: RequestInit) => {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    })

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
}