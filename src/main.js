// Importa os estilos
import './style.css'

// Importa as funções de áudio
import { listAudioDevices, startAudioAnalysis, stopAudioAnalysis, startRecording, stopRecording } from './js/audioDevices.js'

// Importa as funções de upload de arquivo
import './js/fileUpload.js'

// Importa o componente da navbar
import { createNavbar } from './components/Navbar.js'

// Importa o gerenciador de temas
import { initializeTheme } from './js/themeManager.js'

// Importa o componente AppointmentForm
import AppointmentForm from './components/AppointmentForm.js'

// Adiciona a navbar ao DOM
document.body.insertBefore(createNavbar(), document.body.firstChild);

// Inicializa o sistema de temas
initializeTheme();

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    // Renderiza o componente AppointmentForm primeiro
    document.getElementById('app').innerHTML = AppointmentForm();

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

    // Conecta os botões de gravação
    const startRecordingBtn = document.getElementById('startRecording');
    const stopRecordingBtn = document.getElementById('stopRecording');

    startRecordingBtn.addEventListener('click', () => {
        isRecording = true;
        startRecording();
    });

    stopRecordingBtn.addEventListener('click', () => {
        isRecording = false;
        stopRecording();
    });

    // Conecta o select de dispositivos para mudança de dispositivo
    deviceSelect.addEventListener('change', (event) => {
        startAudioAnalysis(event.target.value);
    });
}); 