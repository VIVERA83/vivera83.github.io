// GitHub API Configuration
const USERNAME = 'VIVERA83';
const API_URL = `https://api.github.com/users/${USERNAME}`;
const REPOS_URL = `https://api.github.com/users/${USERNAME}/repos`;
const GITHUB_TOKEN = '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';
const CACHE_TIME = 60 * 60 * 1000; // 1 час кеширования

axios.defaults.headers.common['Authorization'] = `token ${GITHUB_TOKEN}`;


// Get icon for skill
function getSkillIcon(skillName) {
    const icons = {
        'JavaScript': 'fab fa-js',
        'HTML': 'fab fa-html5',
        'CSS': 'fab fa-css3-alt',
        'Python': 'fab fa-python',
        'React': 'fab fa-react',
        'Node.js': 'fab fa-node-js',
        'Vue': 'fab fa-vuejs',
        'Git': 'fab fa-git-alt',
        'Docker': 'fab fa-docker',
        'Database': 'fas fa-database',
        'Java': 'fab fa-java',
        'PHP': 'fab fa-php',
        'C++': 'fas fa-code',
        'TypeScript': 'fas fa-code',
        'Sass': 'fab fa-sass',
        'Linux': 'fab fa-linux'
    };

    return icons[skillName] || 'fas fa-code';
}
// Иконки для фреймворков
function getFrameworkIcon(framework) {
    const icons = {
        'React': 'fab fa-react',
        'Vue': 'fab fa-vuejs',
        'Angular': 'fab fa-angular',
        'Django': 'fab fa-python',
        'Flask': 'fab fa-python',
        'Spring': 'fab fa-java',
        'Laravel': 'fab fa-php',
        'FastAPI': 'fas fa-server',

    };
    return icons[framework] || 'fas fa-code';
}
function getToolIcon(tool) {
    const icons = {
        'Docker': 'fab fa-docker',
        'Git': 'fab fa-git-alt',
        'Webpack': 'fab fa-js',
        'Kubernetes': 'fas fa-cube'
    };
    return icons[tool] || 'fas fa-toolbox';
}
// Render skills section
function renderSkills(skills) {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';

    skills.forEach(([skill, count]) => {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill-card';
        skillElement.innerHTML = `
            <div class="skill-header">
                <i class="${getSkillIcon(skill)} skill-icon"></i>
                <div class="skill-name">${skill}</div>
            </div>
            <div class="skill-projects">Использован в ${count} ${count === 1 ? 'проекте' : 'проектах'}</div>
        `;
        container.appendChild(skillElement);
    });
}

// Render projects section
async function renderRecentUpdates(repos) {
    const container = document.getElementById('updates-container');
    container.innerHTML = '<div class="loading">Загрузка обновлений...</div>';

    // Сортируем репозитории по дате обновления
    const sortedRepos = [...repos]
        .filter(repo => !repo.fork)
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 27); // Берем 5 последних

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

// Initialize activity chart
function initActivityChart() {
    const ctx = document.getElementById('activity-chart').getContext('2d');

    // Mock data - in real project you would use GitHub API for activity
    const data = {
        labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        datasets: [{
            label: 'Коммиты',
            data: [12, 19, 8, 15, 22, 18, 25, 12, 19, 16, 21, 14],
            backgroundColor: 'rgba(79, 195, 247, 0.2)',
            borderColor: '#4fc3f7',
            borderWidth: 2,
            tension: 0.3
        }]
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}




// Detect skills from repositories
function detectSkills(repos) {
    const skills = new Map();
    const frameworks = new Map();
    const databases = new Map();
    const tools = new Map();

    // Расширенные списки технологий
    const FRAMEWORKS = {
        'React': ['react', 'next.js', 'gatsby'],
        'Vue': ['vue', 'nuxt.js'],
        'Angular': ['angular'],
        'Django': ['django'],
        'Flask': ['flask'],
        'Express': ['express'],
        'Spring': ['spring'],
        'FastAPI': ['fastapi'],
        'AIOHTTP': ['aiohttp'],
    };

    const DATABASES = {
        'MySQL': ['mysql'],
        'PostgreSQL': ['postgres', 'postgresql'],
        'MongoDB': ['mongodb'],
        'Redis': ['redis'],
        'SQLite': ['sqlite'],
        'Firebase': ['firebase']
    };

    const TOOLS = {
        'Docker': ['docker'],
        'Git': ['git'],
        'Webpack': ['webpack'],
        'Kubernetes': ['kubernetes', 'k8s']
    };

    repos.forEach(repo => {
        // Основные языки
        if (repo.language) {
            skills.set(repo.language, (skills.get(repo.language) || 0) + 1);
        }

        // Анализ README для дополнительных технологий
        let readmeContent = '';
        if (repo.description) readmeContent += repo.description.toLowerCase() + ' ';
        if (repo.topics) readmeContent += repo.topics.join(' ') + ' ';

        // Поиск технологий в контенте
        const findTechnology = (techMap) => {
            for (const [tech, keywords] of Object.entries(techMap)) {
                for (const keyword of keywords) {
                    if (readmeContent.includes(keyword)) {
                        return tech;
                    }
                }
            }
            return null;
        };

        // Определяем технологии
        const framework = findTechnology(FRAMEWORKS);
        if (framework) frameworks.set(framework, (frameworks.get(framework) || 0) + 1);

        const database = findTechnology(DATABASES);
        if (database) databases.set(database, (databases.get(database) || 0) + 1);

        const tool = findTechnology(TOOLS);
        if (tool) tools.set(tool, (tools.get(tool) || 0) + 1);
    });

    return {
        skills: Array.from(skills.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8),
        frameworks: Array.from(frameworks.entries()).sort((a, b) => b[1] - a[1]),
        databases: Array.from(databases.entries()).sort((a, b) => b[1] - a[1]),
        tools: Array.from(tools.entries()).sort((a, b) => b[1] - a[1])
    };
}

// Новые функции для отрисовки
function renderFrameworks(frameworks) {
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

function renderDatabases(databases) {
    const container = document.getElementById('databases-container');
    container.innerHTML = databases.length > 0 ? '' : '<p>Базы данных не обнаружены</p>';

    databases.forEach(([database, count]) => {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.innerHTML = `
            <div class="skill-header">
                <i class="fas fa-database skill-icon"></i>
                <div class="skill-name">${database}</div>
            </div>
            <div class="skill-projects">Использована в ${count} проектах</div>
        `;
        container.appendChild(card);
    });
}


function renderTools(tools) {
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

function updateRepoCount(userData) {
    const repoCountElement = document.getElementById('repo-count');
    if (repoCountElement && userData) {
        repoCountElement.innerHTML = `<i class="fas fa-code-branch"></i> Репозитории: ${userData.public_repos}`;
    }
}
// Функция для получения данных с кешированием
async function fetchWithCache(url, cacheKey) {
    // Проверяем кеш
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(`${cacheKey}_time`);

    if (cachedData && cachedTime && Date.now() - cachedTime < CACHE_TIME) {
        return JSON.parse(cachedData);
    }

    // Делаем запрос к API
    const response = await axios.get(url);
    const data = response.data;

    // Сохраняем в кеш
    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(`${cacheKey}_time`, Date.now());

    return data;
}

// Load GitHub data
async function loadGitHubData() {
    try{
        const [userData, reposData] = await Promise.all([
            fetchWithCache(API_URL, 'github_user'),
            fetchWithCache(REPOS_URL, 'github_repos')
        ]);
        updateRepoCount(userData);

        // Render skills
        const { skills, frameworks, databases,tools } = detectSkills(reposData);
        renderSkills(skills);
        renderFrameworks(frameworks);
        renderDatabases(databases);
        renderTools(tools);
        await renderRecentUpdates(reposData);
        initActivityChart();

    } catch (error) {
        console.error('Ошибка загрузки данных с GitHub:', error);
        if (localStorage.getItem('github_user')) {
            const userData = JSON.parse(localStorage.getItem('github_user'));
            updateRepoCount(userData);
        }
        document.getElementById('skills-container').innerHTML =
            '<p>Не удалось загрузить данные с GitHub. Проверьте подключение к интернету.</p>';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadGitHubData();
});