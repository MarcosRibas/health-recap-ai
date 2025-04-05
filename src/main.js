// Importa os estilos
import './style.css'

// Importa as funções de áudio
import { listAudioDevices, startAudioAnalysis, stopAudioAnalysis } from './js/audioDevices.js'

// Importa as funções de upload de arquivo
import './js/fileUpload.js'

// Importa o componente da navbar
import { createNavbar } from './components/Navbar.js'

// Adiciona a navbar ao DOM
document.body.insertBefore(createNavbar(), document.body.firstChild);

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    // Lista os dispositivos de áudio disponíveis
    listAudioDevices();

    // Adiciona evento ao select de dispositivos
    const deviceSelect = document.getElementById('audioDevices');
    deviceSelect.addEventListener('change', (event) => {
        startAudioAnalysis(event.target.value);
    });

    // Adiciona evento ao botão de microfone para iniciar/parar a análise
    const micButton = document.querySelector('.ph-microphone').parentElement;
    let isAnalyzing = true;
    
    micButton.addEventListener('click', () => {
        if (isAnalyzing) {
            stopAudioAnalysis();
            micButton.classList.remove('text-purple-600');
            micButton.classList.add('text-gray-500');
        } else {
            startAudioAnalysis(deviceSelect.value);
            micButton.classList.remove('text-gray-500');
            micButton.classList.add('text-purple-600');
        }
        isAnalyzing = !isAnalyzing;
    });

    // Lógica para alternar entre os botões de modalidade
    const modalityButtons = document.querySelectorAll('[data-modality]');
    modalityButtons.forEach(button => {
        button.addEventListener('click', () => {
            modalityButtons.forEach(btn => btn.classList.remove('bg-white'));
            button.classList.add('bg-white');
        });
    });
}); 