export function createChat() {
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';
    chatContainer.className = 'fixed bottom-4 right-4 z-50';
    
    // Estado inicial do chat (minimizado)
    let isExpanded = false;
    
    // HTML do chat
    chatContainer.innerHTML = `
        <div class="flex flex-col">
            <!-- Chat minimizado -->
            <button id="chat-toggle" class="bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg ml-auto transition-all duration-300">
                <i class="ph ph-chat-circle-dots text-2xl"></i>
            </button>
            
            <!-- Chat expandido -->
            <div id="chat-expanded" class="hidden bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-80 h-[32rem] mb-4 flex flex-col">
                <!-- Cabeçalho -->
                <div class="p-4 border-b border-gray-200 dark:border-neutral-700 flex flex-col">
                    <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Assistente Virtual</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Tire suas dúvidas sobre a consulta</p>
                </div>
                
                <!-- Área de mensagens -->
                <div class="flex-1 p-4 overflow-y-auto space-y-4">
                    <!-- Mensagem do assistente -->
                    <div class="flex items-start space-x-2">
                        <div class="flex items-start space-x-2">
                            <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                                <i class="ph ph-robot text-lg"></i>
                            </div>
                            <div class="bg-gray-100 dark:bg-neutral-700 rounded-lg p-3 max-w-[80%]">
                                <p class="text-gray-700 dark:text-gray-200">Olá! Como posso ajudar você com informações sobre esta consulta?</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Mensagem do usuário -->
                    <div class="flex items-start justify-end space-x-2">
                        <div class="bg-primary text-white rounded-lg p-3 max-w-[80%]">
                            <p>Quais são os principais sintomas do paciente?</p>
                        </div>
                        <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-600 flex items-center justify-center">
                            <i class="ph ph-user text-gray-600 dark:text-gray-200 text-lg"></i>
                        </div>
                    </div>
                </div>
                
                <!-- Área de input -->
                <div class="p-4">
                    <div class="flex space-x-2">
                        <input 
                            type="text" 
                            placeholder="Digite sua mensagem..." 
                            class="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-neutral-700 border-none text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                        <button class="text-primary hover:text-primary-dark p-2 rounded-lg transition-colors duration-200">
                            <i class="ph ph-paper-plane-right text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Adiciona os event listeners
    const toggleButton = chatContainer.querySelector('#chat-toggle');
    const minimizeButton = chatContainer.querySelector('#chat-minimize');
    const expandedChat = chatContainer.querySelector('#chat-expanded');
    
    toggleButton.addEventListener('click', () => {
        isExpanded = !isExpanded;
        expandedChat.classList.toggle('hidden');
        toggleButton.classList.toggle('hidden');
    });
    
    minimizeButton?.addEventListener('click', () => {
        isExpanded = false;
        expandedChat.classList.add('hidden');
        toggleButton.classList.remove('hidden');
    });
    
    return chatContainer;
} 