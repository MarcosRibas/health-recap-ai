// Importa os estilos
import './style.css'

// Importa as funções de áudio
import { listAudioDevices, startAudioAnalysis, stopAudioAnalysis, startRecording, stopRecording } from './js/audioDevices.js'

// Importa as funções de upload de arquivo
import { updateFileName } from './js/fileUpload.js'

// Importa o componente da navbar
import { createNavbar } from './components/Navbar.js'

// Importa o componente da sidebar
import { createSidebar } from './components/Sidebar.js'

// Importa o gerenciador de temas
import { initializeTheme } from './js/themeManager.js'

// Importa o AppointmentForm do appointmentManager
import { AppointmentForm } from './js/appointmentManager.js'

// Função para inicializar os eventos do formulário
export async function initializeFormEvents() {
    // Pequeno delay para garantir que o DOM está pronto
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Obtém referências aos elementos após a renderização
    const fileInput = document.getElementById('fileUpload');
    const deviceSelect = document.getElementById('audioDevices');
    const micButton = document.querySelector('.ph-microphone')?.parentElement;
    const startRecordingBtn = document.getElementById('startRecording');
    const stopRecordingBtn = document.getElementById('stopRecording');
    const preRecordingVolumeBars = document.getElementById('preRecordingVolumeBars');

    // Inicializa a análise de áudio
    if (deviceSelect) {
        await listAudioDevices();
        // Inicia a análise de áudio com o dispositivo selecionado
        if (deviceSelect.value) {
            await startAudioAnalysis(deviceSelect.value);
        }
        deviceSelect.addEventListener('change', async (event) => {
            await startAudioAnalysis(event.target.value);
        });
    }

    // Adiciona eventos para os botões de gravação
    if (startRecordingBtn && stopRecordingBtn) {
        startRecordingBtn.addEventListener('click', () => {
            startRecording();
            startRecordingBtn.classList.add('hidden');
            stopRecordingBtn.classList.remove('hidden');
        });

        stopRecordingBtn.addEventListener('click', () => {
            stopRecording();
            stopRecordingBtn.classList.add('hidden');
            startRecordingBtn.classList.remove('hidden');
        });
    }

    // Adiciona evento para upload de arquivo
    if (fileInput) {
        fileInput.addEventListener('change', () => updateFileName(fileInput));
    }
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Previne rolagem no body
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
        
        // Adiciona a navbar ao DOM
        document.body.insertBefore(createNavbar(), document.body.firstChild);

        // Adiciona a sidebar ao DOM
        const sidebar = createSidebar();
        document.body.insertBefore(sidebar, document.body.firstChild.nextSibling);

        // Inicializa o sistema de temas
        initializeTheme();
        
        // Renderiza o componente AppointmentForm primeiro
        const appElement = document.getElementById('app');
        if (!appElement) {
            throw new Error('Elemento app não encontrado');
        }

        // Ajusta o container principal para ocupar toda a largura disponível
        appElement.parentElement.className = 'main-content ml-0 transition-all duration-300 h-[calc(100vh-4rem)] mt-16';
        appElement.className = 'h-full overflow-hidden';

        // Adiciona a classe que esconde a sidebar
        sidebar.classList.add('-translate-x-full');

        // Adiciona evento de clique ao botão de toggle
        const toggleButton = document.querySelector('nav button[title="Menu"]');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                sidebar.classList.toggle('-translate-x-full');
                const mainContent = document.querySelector('.main-content');
                if (mainContent) {
                    mainContent.classList.toggle('ml-0');
                    mainContent.classList.toggle('ml-64');
                }
            });
        }

        // Renderiza o formulário
        appElement.innerHTML = AppointmentForm();

        // Inicializa os eventos do formulário
        await initializeFormEvents();

    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
    }
}); 