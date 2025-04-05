export class AudioRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.startTime = null;
        this.timerInterval = null;
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
        recordingContent.innerHTML = `
            <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span class="text-gray-700 dark:text-gray-200">Gravando</span>
                    <div id="recordingVolumeBars" class="volume-bars-container flex items-center space-x-0.5 h-4 ml-2"></div>
                </div>
                <span id="recordingTimer" class="text-gray-700 dark:text-gray-200">00:00</span>
            </div>
        `;
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
        }
    }
} 