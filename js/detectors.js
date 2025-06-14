export function detectSkills(repos) {
    const skills = new Map();
    const frameworks = new Map();
    const databases = new Map();
    const tools = new Map();

    const FRAMEWORKS = {
        'React': ['react', 'next.js', 'gatsby'],
        'Django': ['django'],
        'Flask': ['flask'],
        'FastAPI': ['fastapi'],
        'AIOHTTP': ['aiohttp'],
        'Asyncio': ['asyncio'],
        'Pydantic': ['pydantic', 'pydantic-settings'],
        'Selenium': ['selenium-python', 'selenium'],
        'Yandex': ['yadisk'],
        'Uvicorn': ['uvicorn'],
        'Alembic': ['alembic'],
        'Telegram': ['telethon']
    };

    const DATABASES = {
        'PostgreSQL': ['postgres', 'postgresql'],
        'MySQL': ['mysql'],
        'MongoDB': ['mongodb'],
        'SQLite': ['sqlite'],
        'Redis': ['redis'],
        'RabbitMQ': ['aio-pika'],
        'MinIO': ['minio', 'miniopy_async'],
    };

    const TOOLS = {
        'Docker': ['docker'],
        'Git': ['git'],
        'Kubernetes': ['kubernetes', 'k8s'],
        'Nginx': ['nginx'],
    };

    repos.forEach(repo => {
        if (repo.language) {
            skills.set(repo.language, (skills.get(repo.language) || 0) + 1);
        }

        let readmeContent = '';
        if (repo.description) readmeContent += repo.description.toLowerCase() + ' ';
        if (repo.topics) readmeContent += repo.topics.join(' ') + ' ';

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