import { saveAppointment, generateDocument } from './appointmentManager.js';

// Função para atualizar o nome do arquivo selecionado e exibir o áudio
export function updateFileName(input) {
    
    const uploadText = document.getElementById('uploadText');
    const recordingState = document.getElementById('recordingState');
    const recordingContent = recordingState.querySelector('.recording-content');
    const preRecordingState = document.getElementById('preRecordingState');
    
    if (!uploadText || !recordingState || !recordingContent || !preRecordingState) {
        console.error('Elementos necessários não encontrados:', {
            uploadText: !!uploadText,
            recordingState: !!recordingState,
            recordingContent: !!recordingContent,
            preRecordingState: !!preRecordingState
        });
        return;
    }
    
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

        // Adiciona tratamento de erro para o áudio
        audioElement.onerror = (e) => {
            console.error('Erro ao carregar o áudio:', e);
        };

        // Adiciona evento de carregamento do áudio
        audioElement.onloadeddata = () => {
            console.log('Áudio carregado com sucesso');
        };

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
        
        // Limpa o conteúdo anterior e adiciona o novo
        recordingContent.innerHTML = '';
        
        // Adiciona o cabeçalho
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between w-full';
        recordingContent.appendChild(header);
        
        // Adiciona o player de áudio
        const audioContainer = document.createElement('div');
        audioContainer.className = 'mt-4';
        audioContainer.appendChild(audioElement);
        recordingContent.appendChild(audioContainer);
        
        // Adiciona o botão de download
        const downloadContainer = document.createElement('div');
        downloadContainer.className = 'mt-2';
        downloadContainer.appendChild(downloadButton);
        recordingContent.appendChild(downloadContainer);

        // Modifica o botão de upload para o botão de gerar documento
        const uploadLabel = document.querySelector('label.flex-1');
        if (uploadLabel) {
            uploadLabel.innerHTML = `
                <button type="button" class="w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center justify-center space-x-2 cursor-pointer">
                    <i class="ph ph-sparkle text-xl"></i>
                    <span>Gerar Documento</span>
                </button>
            `;

            // Adiciona o evento de clique para gerar o documento
            const generateButton = uploadLabel.querySelector('button');
            if (generateButton) {
                generateButton.onclick = async () => {
                    try {
                        // Primeiro salva a consulta
                        const response = await saveAppointment(file, fileName);
                        console.log('Resposta do saveAppointment:', response);
                        
                        // Verifica se a resposta tem o ID
                        if (response && response.id) {
                            console.log('ID da consulta obtido:', response.id);
                            await generateDocument(response.id);
                        } else {
                            console.error('Resposta sem ID:', response);
                            throw new Error('Não foi possível obter o ID da consulta após salvar. Resposta:', JSON.stringify(response));
                        }
                    } catch (error) {
                        console.error('Erro ao gerar documento:', error);
                        alert('Erro ao gerar documento: ' + error.message);
                    }
                };
            }
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
                       accept="audio/*" 
                       class="hidden" 
                       id="fileUpload">
                <div class="w-full py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2 cursor-pointer">
                    <i class="ph ph-upload-simple text-xl text-white"></i>
                    <span id="uploadText" class="text-white">Subir Gravação</span>
                </div>
            `;
        }
    }
}