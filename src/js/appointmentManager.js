// Importa a função initializeFormEvents
import { initializeFormEvents } from '../main.js';

// Função para gerar o formulário
export function AppointmentForm() {
    return `
        <main class="bg-white dark:bg-gray-800 form-container rounded-lg shadow-md p-6 mx-auto">
            <form class="space-y-6">
                <div class="space-y-2">
                    <label class="block text-gray-700 dark:text-gray-200">
                        Modelo de documento
                        <div class="relative mt-2">
                            <select class="block w-full py-2 px-4 border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary">
                                <option>Anamnese padrão</option>
                                <option>Cardiologia</option>
                                <option>Cirurgia</option>
                                <option>Consulta de retorno</option>
                                <option>Dermatologia</option>
                                <option>Endocrinologia</option>
                                <option>Evolução de enfermaria</option>
                                <option>Fisioterapia</option>
                                <option>Gastroenterologia</option>
                                <option>Geriatria</option>
                                <option>Geriatria - Novo</option>
                                <option>Ginecologia / Saúde da mulher</option>
                                <option>Medicina do Esporte</option>
                                <option>Medicina do Trabalho</option>
                                <option>Neurologia</option>
                                <option>Nutrição</option>
                                <option>Nutrologia</option>
                                <option>Obstetrícia</option>
                                <option>Odontologia</option>
                                <option>Oftalmologia</option>
                                <option>Oncologia</option>
                                <option>Ortopedia</option>
                                <option>Otorrinolaringologia</option>
                                <option>Pediatria</option>
                                <option>Perícia médica</option>
                                <option>Pneumologia</option>
                                <option>Psicologia</option>
                                <option>Psiquiatria</option>
                                <option>Reumatologia</option>
                                <option>SOAP</option>
                            </select>
                        </div>
                    </label>
                </div>

                <div class="space-y-2">
                    <label class="block text-gray-700 dark:text-gray-200">
                        Contexto do paciente
                        <textarea
                            class="mt-2 block w-full rounded-lg border p-4 text-gray-700 dark:text-white dark:bg-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-primary"
                            rows="4"
                            placeholder="Preencha este campo com informações clínicas do paciente: medicamentos, prontuários anteriores ou exames. Isso ajuda a fornecer um documento clínico mais completo."
                        ></textarea>
                    </label>
                </div>

                <div class="space-y-2">
                    <label class="block text-gray-700 dark:text-gray-200">
                        Gravação
                        <div class="mt-2 flex items-center space-x-2 border dark:border-gray-600 rounded-lg p-4">
                            <!-- Estado inicial - Seleção de microfone -->
                            <div id="preRecordingState" class="flex items-center space-x-2 w-full">
                                <div class="flex items-center space-x-2">
                                    <button type="button" class="p-2 text-gray-500 hover:text-primary">
                                        <i class="ph ph-microphone text-2xl"></i>
                                    </button>
                                    <div id="preRecordingVolumeBars" class="volume-bars-container flex items-center space-x-0.5 h-4"></div>
                                </div>
                                <select id="audioDevices" class="flex-1 bg-transparent border-0 focus:ring-0 truncate text-ellipsis dark:text-gray-200 dark:[&>option]:bg-gray-700 dark:[&>option]:text-gray-200">
                                    <option>Selecione um microfone...</option>
                                </select>
                            </div>

                            <!-- Estado de gravação -->
                            <div id="recordingState" class="hidden w-full">
                                <div class="recording-content">
                                    <!-- O conteúdo será preenchido dinamicamente -->
                                </div>
                            </div>
                        </div>
                    </label>
                </div>

                <div class="flex gap-6 mt-6" style="gap: 10px;">
                    <!-- Botão de iniciar gravação -->
                    <button type="button" id="startRecording" class="flex-1 py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center justify-center space-x-2">
                        <i class="ph ph-record text-xl"></i>
                        <span>Gravar consulta</span>
                    </button>

                    <!-- Botão de finalizar gravação -->
                    <button type="button" id="stopRecording" class="hidden flex-1 py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center space-x-2">
                        <i class="ph ph-stop-circle text-xl"></i>
                        <span>Finalizar consulta</span>
                    </button>

                    <!-- Upload de arquivo -->
                    <label class="flex-1">
                        <input type="file" 
                               accept="audio/*,.txt" 
                               class="hidden" 
                               id="fileUpload"
                               multiple>
                        <div class="w-full py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2 cursor-pointer">
                            <i class="ph ph-upload-simple text-xl text-white"></i>
                            <span id="uploadText" class="text-white">Subir Arquivo</span>
                        </div>
                    </label>
                </div>
            </form>
        </main>
    `;
}

// Função para atualizar a lista de consultas na sidebar
export async function updateAppointmentsList() {
    try {
        const response = await fetch('/api/appointments');
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar consultas: ${response.status} ${response.statusText}`);
        }
        
        const appointments = await response.json();
        
        const appointmentsList = document.querySelector('#appointmentsList');
        if (!appointmentsList) {
            throw new Error('Elemento appointmentsList não encontrado');
        }
        
        appointmentsList.innerHTML = ''; // Limpa a lista atual
        
        if (appointments.length === 0) {
            appointmentsList.innerHTML = `
                <div class="text-sm text-gray-500 dark:text-gray-400 text-center p-4">
                    Nenhuma consulta encontrada
                </div>
            `;
            return;
        }
        
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
                loadAppointment(appointment.id);
            };
            
            appointmentsList.appendChild(appointmentElement);
        });
    } catch (error) {
        console.error('Erro ao atualizar lista de consultas:', error);
        const appointmentsList = document.querySelector('#appointmentsList');
        if (appointmentsList) {
            appointmentsList.innerHTML = `
                <div class="text-sm text-red-500 dark:text-red-400 text-center p-4">
                    Erro ao carregar consultas: ${error.message}
                </div>
            `;
        }
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
export async function saveAppointment(audioBlob, audioFileName, textContent = null) {
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
            audio_filename: audioFileName,
            text_content: textContent // Novo campo para conteúdo do arquivo de texto
        };
        
        // Envia os dados para o servidor
        const response = await fetch('/api/appointments', {
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
        
        // Atualiza a lista de consultas na sidebar
        await updateAppointmentsList();
        
        // Carrega a visualização da consulta recém-criada
        await loadAppointment(result.id);
        
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

// Função para exibir os detalhes da consulta
export function AppointmentView(appointment) {
    const date = new Date(appointment.created_at);
    const formattedDate = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
        <main class="bg-white dark:bg-gray-800 form-container rounded-lg shadow-md p-6 mx-auto">
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">${appointment.template_type}</h2>
                    <span class="text-sm text-gray-500 dark:text-gray-400">${formattedDate}</span>
                </div>

                <div class="space-y-2">
                    <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Contexto do Paciente</h3>
                    <p class="text-gray-600 dark:text-gray-300">${appointment.patient_context || 'Nenhum contexto fornecido'}</p>
                </div>

                <div class="space-y-2">
                    <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Áudio da Consulta</h3>
                    ${appointment.audio_file && appointment.audio_file !== 'data:audio/wav;base64,' ? `
                        <audio controls class="w-full">
                            <source src="data:audio/wav;base64,${appointment.audio_file}" type="audio/wav">
                            Seu navegador não suporta o elemento de áudio.
                        </audio>
                    ` : '<p class="text-gray-500 dark:text-gray-400">Nenhum áudio disponível</p>'}
                </div>

                ${appointment.text_content ? `
                    <div class="space-y-2">
                        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Conteúdo do Arquivo de Texto</h3>
                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <pre class="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">${appointment.text_content}</pre>
                        </div>
                    </div>
                ` : ''}

                ${appointment.transcription ? `
                    <div class="space-y-2">
                        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Transcrição</h3>
                        <p class="text-gray-600 dark:text-gray-300">${appointment.transcription}</p>
                    </div>
                ` : ''}

                ${appointment.generated_document ? `
                    <div class="space-y-2">
                        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Documento Gerado</h3>
                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <pre class="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">${appointment.generated_document}</pre>
                        </div>
                    </div>
                ` : ''}
            </div>
        </main>
        <main class="bg-white dark:bg-gray-800 form-container rounded-lg shadow-md p-6 mx-auto mt-6">
            <div class="space-y-2">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Análise da consulta</h2>                     
                ${appointment.analysis ? appointment.analysis.replace(/^["']|["']$/g, '').replace(/\\n/g, '<br>').replace(/\\"/g, '"').replace(/^deu certo$/g, 'Análise concluída com sucesso') : 'Nenhuma resposta disponível'} 
            </div>
        </main>        
    `;
}

// Função para limpar marcadores Markdown e tags HTML
function cleanMarkdownAndHtml(text) {
    // Remove marcadores de código Markdown
    text = text.replace(/```[a-z]*\n/g, '').replace(/```/g, '');
    return text;
}

// Função para decodificar string HTML com escape
function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

// Função para carregar uma consulta específica
export async function loadAppointment(id) {
    try {
        const appElement = document.getElementById('app');
        if (!appElement) {
            throw new Error('Elemento app não encontrado');
        }

        // Exibe tela de carregamento
        appElement.innerHTML = `
            <div class="bg-white dark:bg-gray-800 form-container rounded-lg shadow-md p-6 mx-auto">
                <div class="flex flex-col items-center justify-center space-y-4">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p class="text-gray-700 dark:text-gray-200">Carregando consulta e realizando análise...</p>
                </div>
            </div>
        `;

        // Carrega os dados da consulta
        console.log('Buscando dados da consulta...');
        const response = await fetch(`/api/appointments/${id}`);
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar consulta: ${response.status} ${response.statusText}`);
        }

        const appointment = await response.json();
        console.log('Dados da consulta recebidos:', appointment);

        // Prepara o FormData para enviar ao n8n
        console.log('Preparando áudio para análise...');
        const formData = new FormData();
        const audioBlob = await fetch(`data:audio/wav;base64,${appointment.audio_file}`).then(r => r.blob());
        formData.append('arquivo', audioBlob, 'audio.wav');

        // Faz a chamada para o n8n
        console.log('Enviando áudio para análise no n8n...');
        const n8nResponse = await fetch('https://n8n.robotrock.ai/webhook/health-recap-ai', {
            method: 'POST',
            body: formData
        });

        console.log('Resposta do n8n recebida:', n8nResponse.status);

        if (!n8nResponse.ok) {
            throw new Error(`Erro ao analisar consulta no n8n: ${n8nResponse.status} ${n8nResponse.statusText}`);
        }

        const n8nData = await n8nResponse.json();
        console.log('Dados brutos da análise recebidos:', n8nData);
        
        // Adiciona a análise ao objeto appointment usando a mesma lógica da outra plataforma
        if (Array.isArray(n8nData) && n8nData.length > 0) {
            console.log('Primeiro item da resposta:', n8nData[0]);
            console.log('Output do primeiro item:', n8nData[0].output);
            
            // Remove as aspas extras e caracteres de escape
            let analysisText = n8nData[0].output
                .replace(/^["']|["']$/g, '') // Remove aspas no início e fim
                .replace(/\\n/g, '\n') // Substitui \n por quebra de linha real
                .replace(/\\"/g, '"'); // Substitui \" por "
            
            appointment.analysis = analysisText;
        } else {
            console.log('Resposta não está no formato esperado:', n8nData);
            appointment.analysis = 'Nenhuma análise disponível.';
        }

        console.log('Análise final que será exibida:', appointment.analysis);

        // Tenta renderizar a visualização com tratamento de erro
        console.log('Iniciando renderização...');
        try {
            const htmlContent = AppointmentView(appointment);
            console.log('HTML gerado com sucesso');
            appElement.innerHTML = htmlContent;
            console.log('HTML inserido no DOM');

            // Verifica se o conteúdo está visível
            const mainElement = appElement.querySelector('main');
            if (mainElement) {
                console.log('Dimensões do elemento main:', {
                    offsetWidth: mainElement.offsetWidth,
                    offsetHeight: mainElement.offsetHeight,
                    clientWidth: mainElement.clientWidth,
                    clientHeight: mainElement.clientHeight
                });
            }

            // Força um reflow
            appElement.style.display = 'none';
            appElement.offsetHeight; // Força um reflow
            appElement.style.display = '';

        } catch (renderError) {
            console.error('Erro durante a renderização:', renderError);
            appElement.innerHTML = `
                <div class="bg-white dark:bg-gray-800 form-container rounded-lg shadow-md p-6 mx-auto">
                    <div class="text-center">
                        <h2 class="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
                            Erro ao renderizar consulta
                        </h2>
                        <p class="text-gray-600 dark:text-gray-300 mb-6">
                            ${renderError.message}
                        </p>
                        <div class="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded text-left">
                            <pre class="text-sm text-gray-600 dark:text-gray-300">
                                Dados da análise: ${JSON.stringify(appointment.analysis, null, 2)}
                            </pre>
                        </div>
                        <div class="space-y-4 mt-4">
                            <button onclick="window.location.reload()" 
                                    class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                                Tentar novamente
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        // Abre a sidebar automaticamente
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');
        if (sidebar && mainContent) {
            sidebar.classList.remove('-translate-x-full');
            mainContent.classList.remove('ml-0');
            mainContent.classList.add('ml-64');
        }

    } catch (error) {
        console.error('Erro detalhado:', error);
        const appElement = document.getElementById('app');
        if (appElement) {
            appElement.innerHTML = `
                <div class="bg-white dark:bg-gray-800 form-container rounded-lg shadow-md p-6 mx-auto">
                    <div class="text-center">
                        <h2 class="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
                            Erro ao processar consulta
                        </h2>
                        <p class="text-gray-600 dark:text-gray-300 mb-6">
                            ${error.message}
                        </p>
                        <div class="space-y-4">
                            <button onclick="window.location.reload()" 
                                    class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                                Tentar novamente
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

// Função para ler o conteúdo do arquivo de texto
function readTextFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
}

// Função para inicializar os eventos de upload de arquivo
export function initializeFileUploadEvents() {
    const fileInput = document.getElementById('fileUpload');
    const uploadText = document.getElementById('uploadText');

    fileInput.addEventListener('change', async (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            uploadText.textContent = `${files.length} arquivo(s) selecionado(s)`;

            let audioFile = files.find(f => f.type.startsWith('audio/'));
            let textFile = files.find(f => f.name.endsWith('.txt'));

            try {
                let textContent = null;
                if (textFile) {
                    textContent = await readTextFile(textFile);
                }

                if (audioFile) {
                    await saveAppointment(audioFile, audioFile.name, textContent);
                } else if (textContent) {
                    // Se não houver áudio, mas houver texto
                    const emptyBlob = new Blob([], { type: 'audio/wav' });
                    await saveAppointment(emptyBlob, 'no-audio.wav', textContent);
                }
            } catch (error) {
                console.error('Erro ao processar arquivos:', error);
                alert('Erro ao processar arquivos');
            }
        }
    });
} 