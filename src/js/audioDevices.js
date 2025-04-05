// Função para listar os dispositivos de áudio disponíveis
async function listAudioDevices() {
    try {
        // Primeiro, solicita permissão para acessar os dispositivos de mídia
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Obtém a lista de dispositivos
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        // Filtra apenas os dispositivos de entrada de áudio (microfones)
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        
        // Obtém o select de dispositivos
        const deviceSelect = document.getElementById('audioDevices');
        
        // Limpa as opções existentes
        deviceSelect.innerHTML = '';
        
        // Adiciona cada dispositivo como uma opção
        audioDevices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Microfone ${audioDevices.indexOf(device) + 1}`;
            deviceSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao acessar dispositivos de áudio:', error);
        alert('Por favor, permita o acesso ao microfone para continuar.');
    }
}

// Atualiza a lista quando novos dispositivos são conectados ou desconectados
navigator.mediaDevices.addEventListener('devicechange', listAudioDevices);

// Exporta a função para uso em outros arquivos
export { listAudioDevices }; 