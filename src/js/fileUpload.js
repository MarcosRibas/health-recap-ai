// Função para atualizar o nome do arquivo selecionado
export function updateFileName(input) {
    const fileNameDiv = document.getElementById('fileName');
    const uploadText = document.getElementById('uploadText');
    if (input.files.length > 0) {
        const fileName = input.files[0].name;
        fileNameDiv.textContent = `Arquivo selecionado: ${fileName}`;
        fileNameDiv.classList.remove('hidden');
        uploadText.textContent = 'Alterar arquivo';
    } else {
        fileNameDiv.classList.add('hidden');
        uploadText.textContent = 'Subir Gravação';
    }
}

// Inicializa os listeners quando o documento carregar
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileUpload');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => updateFileName(e.target));
    }
}); 