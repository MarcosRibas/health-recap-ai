// Função para atualizar a lista de consultas na sidebar
export async function updateAppointmentsList() {
    try {
        const response = await fetch('http://localhost:3000/api/appointments');
        const appointments = await response.json();
        
        const appointmentsList = document.querySelector('#appointmentsList');
        if (!appointmentsList) return;
        
        appointmentsList.innerHTML = ''; // Limpa a lista atual
        
        appointments.forEach(appointment => {
            const date = new Date(appointment.created_at);
            const formattedDate = date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const appointmentElement = document.createElement('button');
            appointmentElement.className = 'w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors duration-200';
            appointmentElement.innerHTML = `
                <div class="text-sm font-medium text-gray-700 dark:text-gray-200">${appointment.template_type}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">${formattedDate}</div>
            `;
            
            appointmentElement.onclick = () => {
                // Aqui você pode adicionar a lógica para abrir a consulta
                console.log('Abrir consulta:', appointment.id);
            };
            
            appointmentsList.appendChild(appointmentElement);
        });
    } catch (error) {
        console.error('Erro ao atualizar lista de consultas:', error);
    }
}

// Função para comprimir o áudio
async function compressAudio(audioBlob) {
    try {
        // Criar um elemento de áudio temporário
        const audioElement = document.createElement('audio');
        audioElement.src = URL.createObjectURL(audioBlob);
        
        // Criar um contexto de áudio
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Carregar o áudio no contexto
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Criar um novo buffer com taxa de amostragem reduzida
        const offlineContext = new OfflineAudioContext(
            1, // mono
            audioBuffer.length / 2, // reduzir pela metade
            22050 // taxa de amostragem reduzida
        );
        
        // Criar fonte de áudio
        const source = offlineContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(offlineContext.destination);
        source.start();
        
        // Renderizar o áudio comprimido
        const renderedBuffer = await offlineContext.startRendering();
        
        // Converter o buffer para WAV
        const wavBlob = await audioBufferToWav(renderedBuffer);
        
        return wavBlob;
    } catch (error) {
        console.error('Erro ao comprimir áudio:', error);
        return audioBlob; // Retorna o blob original em caso de erro
    }
}

// Função para converter AudioBuffer para WAV
function audioBufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2;
    const buffer32 = new Float32Array(length);
    const view = new DataView(new ArrayBuffer(44 + length));
    let offset = 0;
    
    // Cabeçalho WAV
    writeString(view, offset, 'RIFF'); offset += 4;
    view.setUint32(offset, 36 + length, true); offset += 4;
    writeString(view, offset, 'WAVE'); offset += 4;
    writeString(view, offset, 'fmt '); offset += 4;
    view.setUint32(offset, 16, true); offset += 4;
    view.setUint16(offset, 1, true); offset += 2;
    view.setUint16(offset, numOfChan, true); offset += 2;
    view.setUint32(offset, buffer.sampleRate, true); offset += 4;
    view.setUint32(offset, buffer.sampleRate * 2 * numOfChan, true); offset += 4;
    view.setUint16(offset, numOfChan * 2, true); offset += 2;
    view.setUint16(offset, 16, true); offset += 2;
    writeString(view, offset, 'data'); offset += 4;
    view.setUint32(offset, length, true); offset += 4;
    
    // Escrever os dados do áudio
    for (let i = 0; i < buffer.numberOfChannels; i++) {
        const channel = buffer.getChannelData(i);
        for (let j = 0; j < channel.length; j++) {
            view.setInt16(offset, channel[j] * 0x7FFF, true);
            offset += 2;
        }
    }
    
    return new Blob([view], { type: 'audio/wav' });
}

// Função auxiliar para escrever strings no DataView
function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

// Função para enviar os dados da consulta para o servidor
export async function saveAppointment(audioBlob, audioFileName) {
    try {
        // Obtém os valores do formulário
        const templateSelect = document.querySelector('select');
        const patientContext = document.querySelector('textarea');
        
        // Comprimir o áudio antes de converter para base64
        const compressedAudio = await compressAudio(audioBlob);
        
        // Converte o Blob de áudio comprimido para base64
        const base64Audio = await blobToBase64(compressedAudio);
        
        // Prepara os dados para envio
        const appointmentData = {
            template_type: templateSelect.value,
            patient_context: patientContext.value,
            audio_file: base64Audio,
            audio_filename: audioFileName
        };
        
        // Envia os dados para o servidor
        const response = await fetch('http://localhost:3000/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Erro ao salvar consulta');
        }
        
        console.log('Consulta salva com sucesso:', result);
        alert('Consulta salva com sucesso!');
        
        // Atualiza a lista de consultas na sidebar
        updateAppointmentsList();
        
    } catch (error) {
        console.error('Erro ao salvar consulta:', error);
        alert(`Erro ao salvar consulta: ${error.message}`);
    }
}

// Função auxiliar para converter Blob para base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result
                .replace('data:', '')
                .replace(/^.+,/, '');
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
} 