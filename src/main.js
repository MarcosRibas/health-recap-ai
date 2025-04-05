// Importa os estilos
import './style.css'

// Importa as funções de áudio
import { listAudioDevices, startAudioAnalysis, stopAudioAnalysis } from './js/audioDevices.js'

// Importa as funções de upload de arquivo
import './js/fileUpload.js'

// Importa o componente da navbar
import { createNavbar } from './components/Navbar.js'

// Importa o gerenciador de temas
import { initializeTheme } from './js/themeManager.js'

// Adiciona a navbar ao DOM
document.body.insertBefore(createNavbar(), document.body.firstChild);

// Inicializa o sistema de temas
initializeTheme();

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    // Lista os dispositivos de áudio disponíveis
    listAudioDevices();

    // Adiciona evento ao select de dispositivos
    const deviceSelect = document.getElementById('audioDevices');
    deviceSelect.addEventListener('change', (event) => {
        if (!isRecording) {
            startAudioAnalysis(event.target.value);
        }
    });

    // Adiciona evento ao botão de microfone para iniciar/parar a análise
    const micButton = document.querySelector('.ph-microphone').parentElement;
    let isAnalyzing = true;
    let isRecording = false;
    
    micButton.addEventListener('click', () => {
        if (!isRecording) {
            if (isAnalyzing) {
                stopAudioAnalysis();
                micButton.classList.remove('text-primary');
                micButton.classList.add('text-gray-500');
            } else {
                startAudioAnalysis(deviceSelect.value);
                micButton.classList.remove('text-gray-500');
                micButton.classList.add('text-primary');
            }
            isAnalyzing = !isAnalyzing;
        }
    });

    // Lógica para alternar entre os botões de modalidade
    const modalityButtons = document.querySelectorAll('[data-modality]');
    modalityButtons.forEach(button => {
        button.addEventListener('click', () => {
            modalityButtons.forEach(btn => btn.classList.remove('bg-white'));
            button.classList.add('bg-white');
        });
    });

    // Elementos do DOM
    const startRecordingBtn = document.getElementById('startRecording');
    const stopRecordingBtn = document.getElementById('stopRecording');
    const preRecordingState = document.getElementById('preRecordingState');
    const recordingState = document.getElementById('recordingState');
    const recordingTimer = document.getElementById('recordingTimer');

    let startTime;
    let timerInterval;

    // Função para formatar o tempo (mm:ss)
    function formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Função para atualizar o timer
    function updateTimer() {
        const currentTime = Date.now() - startTime;
        recordingTimer.textContent = formatTime(currentTime);
    }

    // Iniciar gravação
    startRecordingBtn.addEventListener('click', () => {
        isRecording = true;
        
        // Garantir que a análise de áudio está ativa
        if (!isAnalyzing) {
            startAudioAnalysis(deviceSelect.value);
            isAnalyzing = true;
        }
        
        // Mostrar estado de gravação
        preRecordingState.classList.add('hidden');
        recordingState.classList.remove('hidden');
        
        // Trocar botões
        startRecordingBtn.classList.add('hidden');
        stopRecordingBtn.classList.remove('hidden');
        
        // Iniciar timer
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    });

    // Parar gravação
    stopRecordingBtn.addEventListener('click', () => {
        isRecording = false;
        
        // Mostrar estado inicial
        recordingState.classList.add('hidden');
        preRecordingState.classList.remove('hidden');
        
        // Trocar botões
        stopRecordingBtn.classList.add('hidden');
        startRecordingBtn.classList.remove('hidden');
        
        // Parar timer
        clearInterval(timerInterval);
        recordingTimer.textContent = '00:00';
    });
}); 