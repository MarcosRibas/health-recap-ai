import { updateAppointmentsList, AppointmentForm } from '../js/appointmentManager.js';

export function createSidebar() {
    // Cria a sidebar diretamente
    const sidebar = document.createElement('aside');
    sidebar.id = 'sidebar';
    sidebar.className = 'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 overflow-y-auto';
    
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

        <!-- Primeira Seção: Informações do Paciente -->
        <div class="px-4 py-2">
            <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">Informações do Paciente</h2>
            
            <!-- Informações do Paciente -->
            <div class="space-y-2">
                <button 
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors duration-200 rounded-lg"
                    onclick="const el = document.getElementById('patient-info'); const container = document.querySelector('.flex-1.overflow-y-auto'); if(el && container) { const containerTop = container.getBoundingClientRect().top; const elTop = el.getBoundingClientRect().top; container.scrollTo({top: container.scrollTop + (elTop - containerTop) - 24, behavior: 'smooth'});}">
                    Paciente
                </button>

                <button 
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors duration-200 rounded-lg"
                    onclick="const el = document.getElementById('anamnese'); const container = document.querySelector('.flex-1.overflow-y-auto'); if(el && container) { const containerTop = container.getBoundingClientRect().top; const elTop = el.getBoundingClientRect().top; container.scrollTo({top: container.scrollTop + (elTop - containerTop) - 24, behavior: 'smooth'});}">
                    Anamnese
                </button>

                <button 
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors duration-200 rounded-lg"
                    onclick="const el = document.getElementById('conduct-code'); const container = document.querySelector('.flex-1.overflow-y-auto'); if(el && container) { const containerTop = container.getBoundingClientRect().top; const elTop = el.getBoundingClientRect().top; container.scrollTo({top: container.scrollTop + (elTop - containerTop) - 24, behavior: 'smooth'});}">
                    Alinhamento com Código de Conduta
                </button>

                <button 
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors duration-200 rounded-lg"
                    onclick="const el = document.getElementById('suggested-exams'); const container = document.querySelector('.flex-1.overflow-y-auto'); if(el && container) { const containerTop = container.getBoundingClientRect().top; const elTop = el.getBoundingClientRect().top; container.scrollTo({top: container.scrollTop + (elTop - containerTop) - 24, behavior: 'smooth'});}">
                    Sugestão de Exames
                </button>

                <button 
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors duration-200 rounded-lg"
                    onclick="const el = document.getElementById('preliminary-diagnosis'); const container = document.querySelector('.flex-1.overflow-y-auto'); if(el && container) { const containerTop = container.getBoundingClientRect().top; const elTop = el.getBoundingClientRect().top; container.scrollTo({top: container.scrollTop + (elTop - containerTop) - 24, behavior: 'smooth'});}">
                    Diagnóstico
                </button>
            </div>
        </div>

        <div class="px-4 my-4">
            <div class="border-t border-gray-200 dark:border-neutral-700"></div>
        </div>

        <!-- Segunda Seção: Histórico de Consultas -->
        <div class="px-4 py-2">
            <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">Histórico de Consultas</h2>
            <div id="appointmentsList" class="space-y-2">
                <!-- As últimas 5 consultas serão inseridas aqui dinamicamente -->
            </div>
        </div>
    `;

    // Adiciona evento para o botão de nova consulta
    sidebar.querySelector('#newAppointmentBtn').addEventListener('click', () => {
        window.location.href = '/';
    });

    // Carrega as consultas inicialmente
    updateAppointmentsList();

    return sidebar;
} 