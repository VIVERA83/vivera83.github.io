import {API_URL, REPOS_URL, CACHE_TIME} from './config.js';


// Функция для получения данных с кешированием
export async function fetchWithCache(url, cacheKey) {
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(`${cacheKey}_time`);

    if (cachedData && cachedTime && Date.now() - cachedTime < CACHE_TIME) {
        return JSON.parse(cachedData);
    }

    const response = await axios.get(url);
    const data = response.data;

    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(`${cacheKey}_time`, Date.now());

    return data;
}

export async function loadGitHubData() {
    try {
        const [userData, reposData] = await Promise.all([
            fetchWithCache(API_URL, 'github_user'),
            fetchWithCache(REPOS_URL, 'github_repos')
        ]);

        return {userData, reposData};
    } catch (error) {
        console.error('Ошибка загрузки данных с GitHub:', error);
        throw error;
    }
}