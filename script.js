// GitHub API Configuration
const USERNAME = 'VIVERA83';
const API_URL = `https://api.github.com/users/${USERNAME}`;
const REPOS_URL = `https://api.github.com/users/${USERNAME}/repos`;

// Detect skills from repositories
function detectSkills(repos) {
    const skills = new Map();

    repos.forEach(repo => {
        // Detect by language
        if (repo.language) {
            skills.set(repo.language, (skills.get(repo.language) || 0) + 1);
        }

        // Detect by project topics
        if (repo.topics) {
            repo.topics.forEach(topic => {
                skills.set(topic, (skills.get(topic) || 0) + 1);
            });
        }
    });

    return Array.from(skills.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8); // Top 8 skills
}

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
function renderProjects(repos) {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';

    // Sort by stars and get top 4
    const topRepos = repos
        .filter(repo => !repo.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 10);

    topRepos.forEach(repo => {
        const project = document.createElement('div');
        project.className = 'project-card';
        project.innerHTML = `
            <div class="project-content">
                <div class="project-title">
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                    <span class="project-stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                </div>
                <p class="project-description">${repo.description || 'Описание отсутствует'}</p>
                <div class="project-footer">
                    <span>${repo.language || 'Разное'}</span>
                    <span>Обновлён: ${new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
            </div>
        `;
        container.appendChild(project);
    });
}
function renderRecentUpdates(repos) {
    const container = document.getElementById('updates-container');
    container.innerHTML = '';

    // Сортируем репозитории по дате обновления (сначала самые свежие)
    const sortedRepos = [...repos]
        .filter(repo => !repo.fork)
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 10); // Показываем 5 последних

    sortedRepos.forEach(repo => {
        const update = document.createElement('div');
        update.className = 'update-card';

        // Форматируем дату обновления
        const updatedDate = new Date(repo.updated_at);
        const formattedDate = updatedDate.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        update.innerHTML = `
            <div class="update-header">
                <a href="${repo.html_url}" target="_blank" class="update-title">${repo.name}</a>
                <span class="update-date">${formattedDate}</span>
            </div>
            <p class="update-description">${repo.description || 'Без описания'}</p>
            <div class="update-footer">
                <span class="update-language">${repo.language || 'Разное'}</span>
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

function updateRepoCount(userData) {
    const repoCountElement = document.getElementById('repo-count');
    if (repoCountElement && userData) {
        repoCountElement.innerHTML = `<i class="fas fa-code-branch"></i> Репозитории: ${userData.public_repos}`;
    }
}

async function getCommitCount(repoName) {
    try {
        const response = await axios.get(`https://api.github.com/repos/${USERNAME}/${repoName}/commits?per_page=1`);
        if (response.headers.link) {
            const lastPage = response.headers.link.match(/&page=(\d+)>; rel="last"/);
            return lastPage ? parseInt(lastPage[1]) : 1;
        }
        return 1;
    } catch (error) {
        console.error('Ошибка получения коммитов:', error);
        return '?';
    }
}

function detectSkills(repos) {
    const skills = new Map();
    const frameworks = new Map();
    const databases = new Map();

    // Список для определения технологий
    const FRAMEWORKS = ['React', 'Vue', 'Angular', 'Django', 'Flask', 'Fastapi'];
    const DATABASES = ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle'];

    repos.forEach(repo => {
        // Основные языки
        if (repo.language) {
            skills.set(repo.language, (skills.get(repo.language) || 0) + 1);
        }

        // Поиск в описании репозитория
        const description = repo.description ? repo.description.toLowerCase() : '';

        // Определение фреймворков
        FRAMEWORKS.forEach(fw => {
            if (description.includes(fw.toLowerCase()) ||
                (repo.topics && repo.topics.includes(fw.toLowerCase()))) {
                frameworks.set(fw, (frameworks.get(fw) || 0) + 1);
            }
        });

        // Определение баз данных
        DATABASES.forEach(db => {
            if (description.includes(db.toLowerCase()) ||
                (repo.topics && repo.topics.includes(db.toLowerCase()))) {
                databases.set(db, (databases.get(db) || 0) + 1);
            }
        });
    });

    return {
        skills: Array.from(skills.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8),
        frameworks: Array.from(frameworks.entries()).sort((a, b) => b[1] - a[1]),
        databases: Array.from(databases.entries()).sort((a, b) => b[1] - a[1])
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

// Иконки для фреймворков
function getFrameworkIcon(framework) {
    const icons = {
        'React': 'fab fa-react',
        'Vue': 'fab fa-vuejs',
        'Angular': 'fab fa-angular',
        'Django': 'fab fa-python',
        'Flask': 'fab fa-python',
        'Spring': 'fab fa-java',
        'Laravel': 'fab fa-php'
    };
    return icons[framework] || 'fas fa-code';
}

// Load GitHub data
async function loadGitHubData() {
    try {
        const [userResponse, reposResponse] = await Promise.all([
            axios.get(API_URL),
            axios.get(REPOS_URL)
        ]);

        // Update repo count
        updateRepoCount(userResponse.data);

        // Render skills
        // const skills = detectSkills(reposResponse.data);
        const { skills, frameworks, databases } = detectSkills(reposResponse.data);
        renderSkills(skills);
        renderFrameworks(frameworks);
        renderDatabases(databases);
        // Render projects
        renderProjects(reposResponse.data);

        // Render recent updates
        renderRecentUpdates(reposResponse.data);

        // Initialize chart
        initActivityChart();

    } catch (error) {
        console.error('Ошибка загрузки данных с GitHub:', error);
        document.getElementById('skills-container').innerHTML =
            '<p>Не удалось загрузить данные с GitHub. Проверьте подключение к интернету.</p>';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadGitHubData();
});