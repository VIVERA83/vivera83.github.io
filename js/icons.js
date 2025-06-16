// Get icon for skill
export function getSkillIcon(skillName) {
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
export function getDatabaseIcon(database) {
    const icons =    {
        'PostgreSQL': 'devicon-postgresql-plain',
        'MySQL': 'fas fa-database',
        'MongoDB': 'fas fa-database',
        'SQLite': 'devicon-sqlite-plain',
        'RabbitMQ': 'devicon-rabbitmq-original',
        'Redis': 'devicon-redis-plain',
        'MinIO': 'devicon-amazonwebservices-plain',
    };

    return icons[database] ||  'fas fa-database';
}

// Иконки для фреймворков
export function getFrameworkIcon(framework) {
    const icons = {
        'React': 'fab fa-react',
        'Django': 'fab fa-python',
        'Flask': 'devicon-flask-original',
        'FastAPI': 'devicon-fastapi-plain',
        'Swagger': 'devicon-swagger-plain',
        'Asyncio': 'fas fa-infinity',
        'Pydantic': 'fas fa-check-circle',
        'Selenium': 'fab fa-python',
        'YandexDisk': 'fab fa-python',
        'Uvicorn': 'fas fa-bolt',
        'Alembic': 'fas fa-flask',
        'Telegram': 'fab fa-telegram',
        'Pytest': 'devicon-pytest-plain',
    };
    return icons[framework] || 'fas fa-code';
}

export function getToolIcon(tool) {
    const icons = {
        'Docker': 'fab fa-docker',
        'Git': 'devicon-github-original',
        'Kubernetes': 'fas fa-cube',
        'Nginx': 'devicon-nginx-original',
    };
    return icons[tool] || 'fas fa-toolbox';
}