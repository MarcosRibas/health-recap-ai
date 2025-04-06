import { saveAppointment } from '../appointmentManager.js';

export class AudioRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.startTime = null;
        this.timerInterval = null;
        this.currentAudioBlob = null;
    }

    startRecording(stream) {
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];
        this.isRecording = true;
        this.startTime = Date.now();

        this.mediaRecorder.ondataavailable = (event) => {
            this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            this.onRecordingComplete(audioUrl, audioBlob);
        };

        this.mediaRecorder.start();
        this.startTimer();

        // Atualiza a interface para o estado de gravação
        const recordingState = document.getElementById('recordingState');
        const recordingContent = recordingState.querySelector('.recording-content');
        
        // Limpa o conteúdo anterior
        recordingContent.innerHTML = '';
        
        // Cria o container principal
        const mainContainer = document.createElement('div');
        mainContainer.className = 'flex items-center justify-between w-full';
        
        // Cria o container do lado esquerdo
        const leftContainer = document.createElement('div');
        leftContainer.className = 'flex items-center space-x-2';
        
        // Cria o indicador de gravação
        const recordingIndicator = document.createElement('div');
        recordingIndicator.className = 'w-3 h-3 bg-red-500 rounded-full animate-pulse';
        
        // Cria o texto de gravação
        const recordingText = document.createElement('span');
        recordingText.className = 'text-gray-700 dark:text-gray-200';
        recordingText.textContent = 'Gravando';
        
        // Cria o container das barras de volume
        const volumeBarsContainer = document.createElement('div');
        volumeBarsContainer.id = 'recordingVolumeBars';
        volumeBarsContainer.className = 'volume-bars-container flex items-center space-x-0.5 h-4 ml-2';
        
        // Cria o timer
        const timerElement = document.createElement('span');
        timerElement.id = 'recordingTimer';
        timerElement.className = 'text-gray-700 dark:text-gray-200';
        timerElement.textContent = '00:00';
        
        // Monta a estrutura
        leftContainer.appendChild(recordingIndicator);
        leftContainer.appendChild(recordingText);
        leftContainer.appendChild(volumeBarsContainer);
        
        mainContainer.appendChild(leftContainer);
        mainContainer.appendChild(timerElement);
        
        recordingContent.appendChild(mainContainer);
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.stopTimer();
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            const timerElement = document.getElementById('recordingTimer');
            if (timerElement) {
                timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    onRecordingComplete(audioUrl, audioBlob) {
        this.currentAudioBlob = audioBlob;
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
            a.download = `gravacao-${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.wav`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        // Substitui o conteúdo do estado de gravação
        const recordingState = document.getElementById('recordingState');
        const recordingContent = recordingState.querySelector('.recording-content');
        if (recordingContent) {
            recordingContent.innerHTML = '';
            recordingContent.appendChild(audioElement);
            recordingContent.appendChild(downloadButton);
        }

        // Modifica o botão de upload para o botão de gerar documento
        const uploadLabel = document.querySelector('label.flex-1');
        if (uploadLabel) {
            uploadLabel.innerHTML = `
                <button type="button" class="w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center justify-center space-x-2 cursor-pointer">
                    <i class="ph ph-sparkle text-xl"></i>
                    <span>Gerar Documento</span>
                </button>
            `;
            
            // Remove o evento de upload de arquivo e adiciona o novo evento para gerar documento
            const oldInput = uploadLabel.querySelector('input');
            if (oldInput) {
                oldInput.remove();
            }

            // Adiciona o evento de clique para salvar a consulta
            const generateButton = uploadLabel.querySelector('button');
            if (generateButton) {
                generateButton.onclick = () => {
                    const fileName = `gravacao-${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.wav`;
                    saveAppointment(this.currentAudioBlob, fileName);
                };
            }
        }
    }
} 