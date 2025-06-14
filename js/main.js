import { loadGitHubData } from './api.js';
import { detectSkills } from './detectors.js';
import { renderRecentUpdates, renderFrameworks, renderDatabases, renderTools, updateRepoCount } from './renderers.js';
import { initActivityChart } from './chart.js';
import { GITHUB_TOKEN } from './config.js';

// Установка токена для axios
axios.defaults.headers.common['Authorization'] = `token ${GITHUB_TOKEN}`;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { userData, reposData } = await loadGitHubData();
        updateRepoCount(userData);

        const { frameworks, databases, tools } = detectSkills(reposData);
        // renderSkills(skills);
        renderFrameworks(frameworks);
        renderDatabases(databases);
        renderTools(tools);
        await renderRecentUpdates(reposData);
        initActivityChart();

    } catch (error) {
        console.error('Ошибка:', error);
        if (localStorage.getItem('github_user')) {
            const userData = JSON.parse(localStorage.getItem('github_user'));
            updateRepoCount(userData);
        }
        document.getElementById('skills-container').innerHTML =
            '<p>Не удалось загрузить данные с GitHub. Проверьте подключение к интернету.</p>';
    }
});