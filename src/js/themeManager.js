// Constantes para os temas
const THEME_STORAGE_KEY = 'health-recap-theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

// Classes Tailwind para cada tema
const themeClasses = {
    light: {
        body: 'bg-gray-50',
        navbar: 'bg-white shadow-sm',
        container: 'bg-white',
        text: 'text-gray-700',
        label: 'text-gray-700',
        input: 'bg-white border-gray-200 text-gray-700',
        placeholder: 'placeholder-gray-400',
        button: {
            primary: 'bg-primary text-white hover:bg-primary-dark',
            secondary: 'bg-gray-600 text-white hover:bg-gray-700'
        }
    },
    dark: {
        body: 'bg-neutral-900',
        navbar: 'bg-neutral-800 shadow-sm',
        container: 'bg-neutral-800',
        text: 'text-white',
        label: 'text-white',
        input: 'bg-neutral-700 border-neutral-600 text-white',
        placeholder: 'placeholder-neutral-400',
        button: {
            primary: 'bg-primary text-white hover:bg-primary-dark',
            secondary: 'bg-neutral-700 text-white hover:bg-neutral-600'
        }
    }
};

// Função para obter o tema atual
function getCurrentTheme() {
    return localStorage.getItem(THEME_STORAGE_KEY) || LIGHT_THEME;
}

// Função para aplicar o tema
function applyTheme(theme) {
    const root = document.documentElement;
    const classes = themeClasses[theme];
    const oppositeTheme = theme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
    const oppositeClasses = themeClasses[oppositeTheme];

    // Remove classes do tema anterior do root
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    
    // Atualiza o body
    document.body.className = `${classes.body} min-h-screen`;

    // Atualiza elementos da navbar
    const navbar = document.querySelector('nav');
    if (navbar) {
        navbar.className = `${classes.navbar} fixed top-0 left-0 right-0 z-50`;
    }

    // Atualiza o container principal
    const mainContainer = document.querySelector('main');
    if (mainContainer) {
        mainContainer.className = `${classes.container} form-container rounded-lg shadow-md p-6 mx-auto`;
    }

    // Atualiza labels
    document.querySelectorAll('label').forEach(element => {
        if (!element.classList.contains('flex-1')) {
            // Remove a classe de texto do tema oposto
            element.classList.remove(oppositeClasses.label);
            // Adiciona a classe do tema atual
            element.className = `block ${classes.label}`;
        }
    });

    // Atualiza select de modelo de documento
    document.querySelectorAll('select:not(#audioDevices)').forEach(element => {
        // Remove classes do tema oposto
        element.classList.remove(...oppositeClasses.input.split(' '));
        element.className = `block w-full py-2 px-4 border rounded-lg ${classes.input} focus:ring-2 focus:ring-primary`;
    });

    // Atualiza textarea
    document.querySelectorAll('textarea').forEach(element => {
        // Remove classes do tema oposto
        element.classList.remove(...oppositeClasses.input.split(' '));
        element.classList.remove(...oppositeClasses.placeholder.split(' '));
        element.className = `mt-2 block w-full rounded-lg border p-4 ${classes.input} ${classes.placeholder} focus:ring-2 focus:ring-primary`;
    });

    // Atualiza select de áudio
    const audioSelect = document.getElementById('audioDevices');
    if (audioSelect) {
        // Remove a classe de texto do tema oposto
        audioSelect.classList.remove(oppositeClasses.text);
        audioSelect.className = `flex-1 bg-transparent border-0 focus:ring-0 truncate text-ellipsis ${classes.text}`;
    }

    // Atualiza os botões
    const primaryButtons = document.querySelectorAll('button[type="button"]:not([data-theme])');
    primaryButtons.forEach(button => {
        if (button.classList.contains('ph-microphone')) {
            button.className = `p-2 text-gray-500 hover:text-primary`;
        }
    });

    // Atualiza textos normais
    document.querySelectorAll('span, div:not(.volume-bar)').forEach(element => {
        if (!element.closest('button') && !element.classList.contains('container')) {
            // Remove a classe de texto do tema oposto
            element.classList.remove(oppositeClasses.text);
            // Adiciona a classe do tema atual
            element.classList.add(classes.text);
        }
    });

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
            darkButton.classList.remove('text-primary');
        } else {
            darkButton.classList.add('text-primary');
            lightButton.classList.remove('text-primary');
        }
    }
}

// Função para inicializar o sistema de temas
export function initializeTheme() {
    const currentTheme = getCurrentTheme();
    applyTheme(currentTheme);

    // Adiciona listeners aos botões de tema
    document.addEventListener('click', (e) => {
        const themeButton = e.target.closest('[data-theme]');
        if (themeButton) {
            const newTheme = themeButton.dataset.theme;
            applyTheme(newTheme);
        }
    });
}

export { getCurrentTheme, applyTheme }; 