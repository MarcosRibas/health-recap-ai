// Importa os estilos
import './style.css'

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    // Lógica para alternar entre os botões de modalidade
    const modalityButtons = document.querySelectorAll('[data-modality]');
    modalityButtons.forEach(button => {
        button.addEventListener('click', () => {
            modalityButtons.forEach(btn => btn.classList.remove('bg-white'));
            button.classList.add('bg-white');
        });
    });
}); 