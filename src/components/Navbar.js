export function createNavbar() {
    const navbar = document.createElement('nav');
    navbar.className = 'bg-white shadow-sm fixed top-0 left-0 right-0 z-50';
    
    navbar.innerHTML = `
        <div class="w-full px-6 h-16 flex items-center justify-between">
            <div class="text-primary font-semibold text-xl">Health Recap AI</div>
            <div class="flex items-center space-x-2">
                <button type="button" 
                        class="p-2 text-gray-500 hover:text-primary rounded-full" 
                        title="Tema claro"
                        data-theme="light">
                    <i class="ph ph-sun text-xl"></i>
                </button>
                <button type="button" 
                        class="p-2 text-gray-500 hover:text-primary rounded-full" 
                        title="Tema escuro"
                        data-theme="dark">
                    <i class="ph ph-moon text-xl"></i>
                </button>
            </div>
        </div>
    `;

    return navbar;
} 