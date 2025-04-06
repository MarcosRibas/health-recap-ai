import { updateAppointmentsList } from '../js/appointmentManager.js';

export function createSidebar() {
    // Cria a sidebar diretamente
    const sidebar = document.createElement('aside');
    sidebar.id = 'sidebar';
    sidebar.className = 'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 transition-all duration-300 -translate-x-full';
    
    // Define o HTML interno com suporte a tema escuro
    sidebar.innerHTML = `
        <div class="p-4">
            <button 
                type="button"
                class="w-full flex items-center justify-start space-x-2 px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors duration-200"
                id="newAppointmentBtn"
            >
                <i class="ph ph-plus text-lg"></i>
                <span>Nova consulta</span>
            </button>
        </div>
        <div class="px-4">
            <div class="border-t border-gray-200 dark:border-neutral-700"></div>
        </div>
        <div class="p-4">
            <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Consultas Recentes</h2>
            <div id="appointmentsList" class="space-y-2">
                <!-- As consultas serão inseridas aqui dinamicamente -->
            </div>
        </div>
    `;
    
    // Adiciona o botão de toggle na navbar
    const navbar = document.querySelector('nav');
    const toggleButton = document.createElement('button');
    toggleButton.className = 'p-2 text-gray-500 hover:text-primary rounded-full mr-2 transition-colors duration-200';
    toggleButton.innerHTML = '<i class="ph ph-list text-xl"></i>';
    
    // Função de toggle melhorada
    toggleButton.onclick = () => {
        const isHidden = sidebar.classList.contains('-translate-x-full');
        
        // Toggle da sidebar
        sidebar.classList.toggle('-translate-x-full');
        
        // Toggle do conteúdo principal
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            if (isHidden) {
                mainContent.classList.remove('ml-0');
                mainContent.classList.add('ml-64');
            } else {
                mainContent.classList.remove('ml-64');
                mainContent.classList.add('ml-0');
            }
        }
    };
    
    // Insere o botão antes dos botões de tema
    const flexContainer = navbar.querySelector('.flex');
    if (flexContainer) {
        flexContainer.insertBefore(toggleButton, flexContainer.firstChild);
    }

    // Adiciona evento para o botão de nova consulta
    sidebar.querySelector('#newAppointmentBtn').addEventListener('click', () => {
        // Aqui você pode adicionar a lógica para criar uma nova consulta
        console.log('Nova consulta');
    });

    // Carrega as consultas inicialmente
    updateAppointmentsList();

    return sidebar;
} 