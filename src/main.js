// Importa os estilos
import './style.css'

// Importa as funções de áudio
import { listAudioDevices, startAudioAnalysis, stopAudioAnalysis, startRecording, stopRecording } from './js/audioDevices.js'

// Importa as funções de upload de arquivo
import { updateFileName } from './js/fileUpload.js'

// Importa o componente da navbar
import { createNavbar } from './components/Navbar.js'

// Importa o gerenciador de temas
import { initializeTheme } from './js/themeManager.js'

// Importa o componente AppointmentForm
import AppointmentForm from './components/AppointmentForm.js'

// Função para inicializar a análise de áudio
async function initializeAudioAnalysis(isRecording, deviceSelect) {
    try {
        // Pequeno delay para garantir que o DOM está pronto
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Lista os dispositivos de áudio disponíveis e obtém a lista
        const audioDevices = await listAudioDevices();

        // Se houver dispositivos e não estiver gravando, inicia a análise com o primeiro
        if (audioDevices.length > 0 && !isRecording) {
            await startAudioAnalysis(audioDevices[0].deviceId);
        }
    } catch (error) {
        console.error('Erro ao inicializar análise de áudio:', error);
    }
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', async () => {
    
    // Variáveis de controle
    let isRecording = false;
    let isAnalyzing = true;
    
    try {
        // Adiciona a navbar ao DOM
        document.body.insertBefore(createNavbar(), document.body.firstChild);

        // Inicializa o sistema de temas
        initializeTheme();
        
        // Renderiza o componente AppointmentForm primeiro
        const appElement = document.getElementById('app');
        if (!appElement) {
            throw new Error('Elemento app não encontrado');
        }

        // Renderiza o formulário
        appElement.innerHTML = await AppointmentForm();

        // Pequeno delay para garantir que o DOM está atualizado
        await new Promise(resolve => setTimeout(resolve, 100));

        // Obtém referências aos elementos após a renderização
        const fileInput = document.getElementById('fileUpload');
        const deviceSelect = document.getElementById('audioDevices');
        const micButton = document.querySelector('.ph-microphone')?.parentElement;
        const startRecordingBtn = document.getElementById('startRecording');
        const stopRecordingBtn = document.getElementById('stopRecording');
        const preRecordingVolumeBars = document.getElementById('preRecordingVolumeBars');

        // Verifica se todos os elementos necessários foram encontrados
        if (!fileInput || !deviceSelect || !micButton || !startRecordingBtn || !stopRecordingBtn || !preRecordingVolumeBars) {
            console.error('Elementos necessários não encontrados:', {
                fileInput: !!fileInput,
                deviceSelect: !!deviceSelect,
                micButton: !!micButton,
                startRecordingBtn: !!startRecordingBtn,
                stopRecordingBtn: !!stopRecordingBtn,
                preRecordingVolumeBars: !!preRecordingVolumeBars
            });
            return;
        }

        // Registra o evento de mudança do arquivo
        if (fileInput) {
            fileInput.addEventListener('change', (event) => {
                updateFileName(event.target);
            });
        }

        // Inicializa a análise de áudio após a renderização do formulário
        await initializeAudioAnalysis(isRecording, deviceSelect);

        // Adiciona evento ao select de dispositivos
        if (deviceSelect) {
            deviceSelect.addEventListener('change', async (event) => {
                if (!isRecording) {
                    try {
                        await startAudioAnalysis(event.target.value);
                    } catch (error) {
                        console.error('Erro ao iniciar análise de áudio:', error);
                    }
                }
            });
        }

        // Adiciona evento ao botão de microfone
        if (micButton) {
            micButton.addEventListener('click', async () => {
                if (!isRecording) {
                    try {
                        if (isAnalyzing) {
                            stopAudioAnalysis();
                            micButton.classList.remove('text-primary');
                            micButton.classList.add('text-gray-500');
                        } else {
                            await startAudioAnalysis(deviceSelect?.value);
                            micButton.classList.remove('text-gray-500');
                            micButton.classList.add('text-primary');
                        }
                        isAnalyzing = !isAnalyzing;
                    } catch (error) {
                        console.error('Erro ao alternar análise de áudio:', error);
                    }
                }
            });
        }

        // Conecta os botões de gravação
        if (startRecordingBtn) {
            startRecordingBtn.addEventListener('click', () => {
                isRecording = true;
                startRecording();
            });
        }

        if (stopRecordingBtn) {
            stopRecordingBtn.addEventListener('click', () => {
                isRecording = false;
                stopRecording();
            });
        }

    } catch (error) {
        console.error('Erro durante a inicialização:', error);
    }
}); 