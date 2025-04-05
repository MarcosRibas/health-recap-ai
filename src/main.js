// Importa os estilos
import './style.css'

// Importa a função de listagem de dispositivos de áudio
import { listAudioDevices } from './js/audioDevices.js'

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    // Lista os dispositivos de áudio disponíveis
    listAudioDevices();

    // Adiciona evento ao botão de microfone para atualizar a lista
    const micButton = document.querySelector('.ph-microphone').parentElement;
    micButton.addEventListener('click', () => {
        listAudioDevices();
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