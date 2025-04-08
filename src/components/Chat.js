export function createChat() {
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';
    chatContainer.className = 'fixed bottom-4 right-4 z-50';
    
    // Estado inicial do chat (minimizado)
    let isExpanded = false;
    
    // Variável para armazenar os dados da consulta atual
    let currentAppointment = null;
    
    // Função para buscar dados da consulta atual
    async function fetchCurrentAppointment() {
        try {
            const url = new URL(window.location.href);
            const id = url.searchParams.get('id');
            
            if (!id) {
                throw new Error('ID da consulta não encontrado');
            }

            const response = await fetch(`/api/appointments/${id}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar dados da consulta');
            }

            const data = await response.json();
            currentAppointment = data;
            return data;
        } catch (error) {
            console.error('Erro ao buscar consulta:', error);
            return null;
        }
    }
    
    // Função para adicionar mensagem
    function addMessage(message, isUser = false) {
        const messagesContainer = chatContainer.querySelector('#chat-messages');
        const messageHTML = isUser ? `
            <div class="flex items-start justify-end space-x-2">
                <div class="bg-primary text-white rounded-lg p-3 max-w-[80%]">
                    <p>${message}</p>
                </div>
                <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-600 flex items-center justify-center">
                    <i class="ph ph-user text-gray-600 dark:text-gray-200 text-lg"></i>
                </div>
            </div>
        ` : `
            <div class="flex items-start space-x-2">
                <div class="flex items-start space-x-2">
                    <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                        <i class="ph ph-robot text-lg"></i>
                    </div>
                    <div class="bg-gray-100 dark:bg-neutral-700 rounded-lg p-3 max-w-[80%]">
                        <p class="text-gray-700 dark:text-gray-200">${message}</p>
                    </div>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Função para enviar mensagem para o webhook
    async function sendMessageToWebhook(message) {
        try {
            // Adiciona indicador de digitação
            const messagesContainer = chatContainer.querySelector('#chat-messages');
            const typingIndicator = document.createElement('div');
            typingIndicator.id = 'typing-indicator';
            typingIndicator.className = 'flex items-start space-x-2';
            typingIndicator.innerHTML = `
                <div class="flex items-start space-x-2">
                    <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                        <i class="ph ph-robot text-lg"></i>
                    </div>
                    <div class="bg-gray-100 dark:bg-neutral-700 rounded-lg p-3">
                        <div class="flex space-x-1">
                            <div class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                            <div class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                            <div class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                        </div>
                    </div>
                </div>
            `;
            messagesContainer.appendChild(typingIndicator);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Se ainda não temos os dados da consulta, busca eles
            if (!currentAppointment) {
                await fetchCurrentAppointment();
            }

            // Prepara os dados para enviar ao webhook
            const payload = {
                message: message,
                context: {
                    template_type: currentAppointment?.template_type || '',
                    patient_context: currentAppointment?.patient_context || '',
                    transcription: currentAppointment?.transcription || '',
                    analysis: currentAppointment?.analysis || {}
                }
            };

            const response = await fetch('https://n8n.robotrock.ai/webhook/d0125513-afac-4f8d-bc69-9b036ac88d1e', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            // Remove o indicador de digitação
            typingIndicator.remove();

            const data = await response.json();

            if (!data.output) {
                throw new Error('Erro ao enviar mensagem');
            }
            return data.output || 'Desculpe, não consegui processar sua mensagem.';
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            return 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.';
        }
    }
    
    // HTML do chat
    chatContainer.innerHTML = `
        <div class="flex flex-col">
            <!-- Chat minimizado -->
            <button id="chat-toggle" class="bg-primary hover:bg-primary-dark text-white w-12 h-12 rounded-full shadow-lg ml-auto transition-all duration-300 flex items-center justify-center">
                <i class="ph ph-chat-circle-dots text-2xl"></i>
            </button>
            
            <!-- Chat expandido -->
            <div id="chat-expanded" class="hidden bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-96 mt-24 mb-4 flex flex-col" style="height: calc(100vh - 7rem);">
                <!-- Cabeçalho -->
                <div class="p-4 border-b border-gray-200 dark:border-neutral-700">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Assistente Virtual</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Tire suas dúvidas sobre a consulta</p>
                        </div>
                        <button id="chat-minimize" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1">
                            <i class="ph ph-minus-circle text-xl"></i>
                        </button>
                    </div>
                    
                    <!-- Botões de ação rápida -->
                    <div class="grid grid-cols-2 gap-2">
                        <button class="quick-action-btn bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 text-gray-700 dark:text-gray-200 text-sm p-2 rounded-lg transition-colors duration-200 text-left">
                            <i class="ph ph-file-text text-primary mr-2"></i>
                            O que eu deveria solicitar de exames?
                        </button>
                        <button class="quick-action-btn bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 text-gray-700 dark:text-gray-200 text-sm p-2 rounded-lg transition-colors duration-200 text-left">
                            <i class="ph ph-stethoscope text-primary mr-2"></i>
                            Que especialidade encaminhar?
                        </button>
                        <button class="quick-action-btn bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 text-gray-700 dark:text-gray-200 text-sm p-2 rounded-lg transition-colors duration-200 text-left">
                            <i class="ph ph-question text-primary mr-2"></i>
                            Quais perguntas fazer?
                        </button>
                        <button class="quick-action-btn bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 text-gray-700 dark:text-gray-200 text-sm p-2 rounded-lg transition-colors duration-200 text-left">
                            <i class="ph ph-pill text-primary mr-2"></i>
                            O que receitar?
                        </button>
                    </div>
                </div>
                
                <!-- Área de mensagens -->
                <div id="chat-messages" class="flex-1 p-4 overflow-y-auto space-y-4">
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
                </div>
                
                <!-- Área de input -->
                <div class="p-4">
                    <form id="chat-form" class="flex space-x-2">
                        <input 
                            type="text" 
                            id="chat-input"
                            placeholder="Digite sua mensagem..." 
                            class="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-neutral-700 border-none text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                        <button type="submit" class="text-primary hover:text-primary-dark p-2 rounded-lg transition-colors duration-200">
                            <i class="ph ph-paper-plane-right text-xl"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Adiciona os event listeners
    const toggleButton = chatContainer.querySelector('#chat-toggle');
    const minimizeButton = chatContainer.querySelector('#chat-minimize');
    const expandedChat = chatContainer.querySelector('#chat-expanded');
    const chatForm = chatContainer.querySelector('#chat-form');
    const chatInput = chatContainer.querySelector('#chat-input');
    const quickActionButtons = chatContainer.querySelectorAll('.quick-action-btn');
    
    toggleButton.addEventListener('click', () => {
        isExpanded = !isExpanded;
        expandedChat.classList.toggle('hidden');
        toggleButton.classList.toggle('hidden');

        // Busca os dados da consulta quando o chat é aberto pela primeira vez
        if (isExpanded && !currentAppointment) {
            fetchCurrentAppointment();
        }
    });
    
    minimizeButton?.addEventListener('click', () => {
        isExpanded = false;
        expandedChat.classList.add('hidden');
        toggleButton.classList.remove('hidden');
    });

    // Event listener para os botões de ação rápida
    quickActionButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const message = button.textContent.trim();
            addMessage(message, true);
            
            // Envia a mensagem para o webhook e exibe a resposta
            const response = await sendMessageToWebhook(message);
            addMessage(response);
        });
    });

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (message) {
            // Adiciona mensagem do usuário
            addMessage(message, true);
            chatInput.value = '';

            // Envia a mensagem para o webhook e exibe a resposta
            const response = await sendMessageToWebhook(message);
            addMessage(response);
        }
    });

    // Busca os dados da consulta assim que o componente é criado
    fetchCurrentAppointment();
    
    return chatContainer;
} 