// Função para atualizar o nome do arquivo selecionado e exibir o áudio
export function updateFileName(input) {
    const uploadText = document.getElementById('uploadText');
    const recordingState = document.getElementById('recordingState');
    const recordingContent = recordingState.querySelector('.recording-content');
    const preRecordingState = document.getElementById('preRecordingState');
    
    if (input.files.length > 0) {
        const file = input.files[0];
        const fileName = file.name;
        uploadText.textContent = 'Alterar arquivo';

        // Cria URL do arquivo de áudio
        const audioUrl = URL.createObjectURL(file);

        // Cria o elemento de áudio
        const audioElement = document.createElement('audio');
        audioElement.src = audioUrl;
        audioElement.controls = true;
        audioElement.className = 'w-full mt-2';

        // Cria o botão de download
        const downloadButton = document.createElement('button');
        downloadButton.className = 'flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mt-2';
        downloadButton.innerHTML = '<i class="ph ph-download"></i><span>Baixar gravação</span>';
        downloadButton.onclick = () => {
            const a = document.createElement('a');
            a.href = audioUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        // Esconde o estado de pré-gravação e exibe o estado de gravação
        preRecordingState.classList.add('hidden');
        recordingState.classList.remove('hidden');
        recordingContent.innerHTML = '';
        recordingContent.appendChild(audioElement);
        recordingContent.appendChild(downloadButton);

        // Modifica o botão de upload para o botão de gerar documento
        const uploadLabel = document.querySelector('label.flex-1');
        if (uploadLabel) {
            uploadLabel.innerHTML = `
                <button type="button" class="w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center justify-center space-x-2 cursor-pointer">
                    <i class="ph ph-sparkle text-xl"></i>
                    <span>Gerar Documento</span>
                </button>
            `;
        }
    } else {
        uploadText.textContent = 'Subir Gravação';
        recordingState.classList.add('hidden');
        preRecordingState.classList.remove('hidden');
        
        // Restaura o botão de upload original
        const uploadLabel = document.querySelector('label.flex-1');
        if (uploadLabel) {
            uploadLabel.innerHTML = `
                <input type="file" 
                       accept=".txt,audio/*" 
                       class="hidden" 
                       id="fileUpload">
                <div class="w-full py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2 cursor-pointer">
                    <i class="ph ph-upload-simple text-xl text-white"></i>
                    <span id="uploadText" class="text-white" style="color: white;">Subir Gravação</span>
                </div>
            `;
        }
    }
}

// Inicializa os listeners quando o documento carregar
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileUpload');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => updateFileName(e.target));
    }
}); 