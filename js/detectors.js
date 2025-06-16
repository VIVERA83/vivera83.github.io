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
    'Telegram': ['telethon'],
    'Pytest': ['pytest'],
};

const DATABASES = {
    'PostgreSQL': ['postgres', 'postgresql'],
    'MySQL': ['mysql'],
    'MongoDB': ['mongodb'],
    'SQLite': ['sqlite'],
    'Redis': ['redis'],
    'RabbitMQ': ['aio-pika', 'rabbitmq'],
    'MinIO': ['minio', 'miniopy_async'],
};

const TOOLS = {
    'Docker': ['docker'],
    'Git': ['git'],
    'Kubernetes': ['kubernetes', 'k8s'],
    'Nginx': ['nginx'],
};


const findTechnology = (content, techMap) => {
    const result = [];
    for (const [tech, keywords] of Object.entries(techMap)) {
        for (const keyword of keywords) {
            if (content.includes(keyword)) {
                result.push(tech);
            }
        }
    }
    if (result.length > 0) return result;
    return null;
};

function extracted(repo, databases, techMapList) {
    const database = findTechnology(repo.topics, techMapList);
    if (database) {
        for (const keyword of database) {
            databases.set(keyword, (databases.get(keyword) || 0) + 1);
        }

    }
}

export function detectSkills(repos) {
    const skills = new Map();
    const frameworks = new Map();
    const databases = new Map();
    const tools = new Map();

    repos.forEach(repo => {
        if (repo.language) {
            skills.set(repo.language, (skills.get(repo.language) || 0) + 1);
        }
        extracted(repo, skills, FRAMEWORKS);
        extracted(repo, frameworks, FRAMEWORKS);
        extracted(repo, databases, DATABASES);
        extracted(repo, tools, TOOLS);

    });

    return {
        skills: Array.from(skills.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8),
        frameworks: Array.from(frameworks.entries()).sort((a, b) => b[1] - a[1]),
        databases: Array.from(databases.entries()).sort((a, b) => b[1] - a[1]),
        tools: Array.from(tools.entries()).sort((a, b) => b[1] - a[1])
    };
}