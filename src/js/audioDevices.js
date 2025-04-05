// Variáveis para controle do áudio
let audioContext;
let mediaStream;
let mediaStreamSource;
let analyser;
let animationFrame;

// Função para iniciar a análise de áudio
async function startAudioAnalysis(deviceId) {
    try {
        // Cria ou reutiliza o contexto de áudio
        audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
        
        // Se já existe uma stream, para ela
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
        }

        // Obtém nova stream do dispositivo selecionado
        mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: deviceId ? { exact: deviceId } : undefined
            }
        });

        // Configura os nós de análise
        mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 32;
        mediaStreamSource.connect(analyser);

        // Inicia a visualização
        updateVolumeIndicator();
    } catch (error) {
        console.error('Erro ao iniciar análise de áudio:', error);
    }
}

// Função para parar a análise de áudio
function stopAudioAnalysis() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
    }
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    // Reseta o indicador visual
    const indicators = document.querySelectorAll('.volume-bar');
    indicators.forEach(indicator => indicator.style.backgroundColor = '#e5e7eb');
}

// Função para atualizar o indicador de volume
function updateVolumeIndicator() {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    // Calcula o volume médio
    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
    const volume = average / 255; // Normaliza para 0-1

    // Atualiza as barras do indicador
    const indicators = document.querySelectorAll('.volume-bar');
    const activeCount = Math.floor(volume * indicators.length);
    
    indicators.forEach((indicator, index) => {
        if (index < activeCount) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });

    // Continua a animação
    animationFrame = requestAnimationFrame(updateVolumeIndicator);
}

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

        // Se houver dispositivos, inicia a análise com o primeiro
        if (audioDevices.length > 0) {
            startAudioAnalysis(audioDevices[0].deviceId);
        }
    } catch (error) {
        console.error('Erro ao acessar dispositivos de áudio:', error);
        alert('Por favor, permita o acesso ao microfone para continuar.');
    }
}

// Atualiza a lista quando novos dispositivos são conectados ou desconectados
navigator.mediaDevices.addEventListener('devicechange', listAudioDevices);

// Exporta as funções para uso em outros arquivos
export { listAudioDevices, startAudioAnalysis, stopAudioAnalysis }; 