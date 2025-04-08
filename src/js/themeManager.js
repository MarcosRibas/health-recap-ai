// Constantes para os temas
const THEME_STORAGE_KEY = 'health-recap-theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

// Função para obter o tema atual
function getCurrentTheme() {
    // Verifica se há preferência do sistema
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? DARK_THEME : LIGHT_THEME;
    }
    return localStorage.getItem(THEME_STORAGE_KEY);
}

// Função para aplicar o tema
function applyTheme(theme) {
    const root = document.documentElement;
    
    // Remove classes do tema anterior
    root.classList.remove(DARK_THEME, LIGHT_THEME);
    
    // Adiciona a classe do tema atual
    root.classList.add(theme);
    
    // Salva o tema no localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    
    // Atualiza os ícones dos botões de tema
    updateThemeButtons(theme);
}

// Função para atualizar os botões de tema
function updateThemeButtons(currentTheme) {
    const lightButton = document.querySelector('[data-theme="light"]');
    const darkButton = document.querySelector('[data-theme="dark"]');

    if (lightButton && darkButton) {
        if (currentTheme === LIGHT_THEME) {
            lightButton.classList.add('text-primary');
            lightButton.classList.remove('text-gray-500', 'dark:text-dark-text-secondary');
            darkButton.classList.remove('text-primary');
            darkButton.classList.add('text-gray-500', 'dark:text-dark-text-secondary');
        } else {
            darkButton.classList.add('text-primary');
            darkButton.classList.remove('text-gray-500', 'dark:text-dark-text-secondary');
            lightButton.classList.remove('text-primary');
            lightButton.classList.add('text-gray-500', 'dark:text-dark-text-secondary');
        }
    }
}

// Função para inicializar o sistema de temas
export function initializeTheme() {
    const currentTheme = getCurrentTheme();
    
    // Aplica o tema inicial
    applyTheme(currentTheme);

    // Adiciona listeners aos botões de tema
    document.addEventListener('click', (e) => {
        const themeButton = e.target.closest('[data-theme]');
        if (themeButton) {
            const newTheme = themeButton.dataset.theme;
            applyTheme(newTheme);
        }
    });

    // Observa mudanças na preferência de tema do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
            applyTheme(e.matches ? DARK_THEME : LIGHT_THEME);
        }
    });
}

export { getCurrentTheme, applyTheme }; 