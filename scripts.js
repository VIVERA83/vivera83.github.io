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
        .slice(0, 4);

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

// Load GitHub data
async function loadGitHubData() {
    try {
        const [userResponse, reposResponse] = await Promise.all([
            axios.get(API_URL),
            axios.get(REPOS_URL)
        ]);

        // Render skills
        const skills = detectSkills(reposResponse.data);
        renderSkills(skills);

        // Render projects
        renderProjects(reposResponse.data);

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