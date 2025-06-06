export function createNavbar() {
    const navbar = document.createElement('nav');
    navbar.className = 'bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 fixed top-0 left-0 right-0 z-50';
    
    navbar.innerHTML = `
        <div class="w-full px-6 h-16 grid grid-cols-3 items-center">
            <div class="flex items-center">
                <button type="button" 
                        class="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 rounded-full" 
                        title="Menu">
                    <i class="ph ph-list text-xl"></i>
                </button>
            </div>
            <div class="flex items-center justify-center">
                <img src="/logo.png" alt="Fares AI" class="h-8 w-auto" />
            </div>
            <div class="flex items-center justify-end space-x-2">
                <button type="button" 
                        class="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 rounded-full" 
                        title="Tema claro"
                        data-theme="light">
                    <i class="ph ph-sun text-xl"></i>
                </button>
                <button type="button" 
                        class="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 rounded-full" 
                        title="Tema escuro"
                        data-theme="dark">
                    <i class="ph ph-moon text-xl"></i>
                </button>
            </div>
        </div>
    `;

    return navbar;
} 