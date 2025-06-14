import {getDatabaseIcon, getFrameworkIcon, getToolIcon} from './icons.js';


export async function renderRecentUpdates(repos) {
    const container = document.getElementById('updates-container');
    container.innerHTML = '<div class="loading">Загрузка обновлений...</div>';

    // Сортируем репозитории по дате обновления
    const sortedRepos = [...repos]
        .filter(repo => !repo.fork)
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 12);

    // Получаем языки для каждого репозитория
    const reposWithLanguages = await Promise.all(sortedRepos.map(async repo => {
        try {
            const response = await axios.get(repo.languages_url);
            const languages = Object.keys(response.data);
            return {...repo, languages};
        } catch (error) {
            console.error(`Ошибка получения языков для ${repo.name}:`, error);
            return {...repo, languages: repo.language ? [repo.language] : []};
        }
    }));

    container.innerHTML = '';

    // Рендерим карточки с языками
    reposWithLanguages.forEach(repo => {
        const update = document.createElement('div');
        update.className = 'update-card';

        // Форматируем дату
        const updatedDate = new Date(repo.updated_at);
        const formattedDate = updatedDate.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        // Создаем элементы языков
        let languagesHTML = '';
        if (repo.languages && repo.languages.length > 0) {
            languagesHTML = `
                <div class="update-languages">
                    <strong>Языки:</strong>
                    <div class="language-tags">
                        ${repo.languages.map(lang => `<span class="language-tag">${lang}</span>`).join('')}
                    </div>
                </div>
            `;
        }

        update.innerHTML = `
            <div class="update-header">
                <a href="${repo.html_url}" target="_blank" class="update-title">${repo.name}</a>
                <span class="update-date">${formattedDate}</span>
            </div>
            <p class="update-description">${repo.description || 'Без описания'}</p>
            ${languagesHTML}
            <div class="update-footer">
                <span class="update-commit">
                    <i class="fas fa-code-commit"></i> 
                    ${repo.size} коммитов
                </span>
            </div>
        `;
        container.appendChild(update);
    });
}

export function renderFrameworks(frameworks) {
    const container = document.getElementById('frameworks-container');
    container.innerHTML = frameworks.length > 0 ? '' : '<p>Фреймворки не обнаружены</p>';

    frameworks.forEach(([framework, count]) => {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.innerHTML = `
            <div class="skill-header">
                <i class="${getFrameworkIcon(framework)} skill-icon"></i>
                <div class="skill-name">${framework}</div>
            </div>
            <div class="skill-projects">Использован в ${count} проектах</div>
        `;
        container.appendChild(card);
    });
}

export function renderDatabases(databases) {
    const container = document.getElementById('databases-container');
    container.innerHTML = databases.length > 0 ? '' : '<p>Базы данных не обнаружены</p>';

    databases.forEach(([database, count]) => {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.innerHTML = `
            <div class="skill-header">
                 <i class="${getDatabaseIcon(database)} skill-icon"></i>
                <div class="skill-name">${database}</div>
            </div>
            <div class="skill-projects">Использована в ${count} проектах</div>
        `;
        container.appendChild(card);
    });
}

export function renderTools(tools) {
    const container = document.getElementById('tools-container');
    container.innerHTML = tools.length > 0 ? '' : '<p>Инструменты не обнаружены</p>';

    tools.forEach(([tool, count]) => {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.innerHTML = `
            <div class="skill-header">
                <i class="${getToolIcon(tool)} skill-icon"></i>
                <div class="skill-name">${tool}</div>
            </div>
            <div class="skill-projects">Использован в ${count} проектах</div>
        `;
        container.appendChild(card);
    });
}

export function updateRepoCount(userData) {
    const repoCountElement = document.getElementById('repo-count');
    if (repoCountElement && userData) {
        repoCountElement.innerHTML = `<i class="fas fa-code-branch"></i> Репозитории: ${userData.public_repos}`;
    }
}