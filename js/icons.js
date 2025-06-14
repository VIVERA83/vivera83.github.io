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

// Иконки для фреймворков
export function getFrameworkIcon(framework) {
    const icons = {
        'React': 'fab fa-react',
        'Vue': 'fab fa-vuejs',
        'Angular': 'fab fa-angular',
        'Django': 'fab fa-python',
        'Flask': 'fab fa-python',
        'Spring': 'fab fa-java',
        'Laravel': 'fab fa-php',
        'FastAPI': 'fas fa-server',

        'asyncio': 'fab fa-php',
    };
    return icons[framework] || 'fas fa-code';
}

export function getToolIcon(tool) {
    const icons = {
        'Docker': 'fab fa-docker',
        'Git': 'fab fa-git-alt',
        'Webpack': 'fab fa-js',
        'Kubernetes': 'fas fa-cube'
    };
    return icons[tool] || 'fas fa-toolbox';
}