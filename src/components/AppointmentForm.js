export default async function AppointmentForm() {
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
                                <select id="audioDevices" class="flex-1 bg-transparent border-0 focus:ring-0 truncate text-ellipsis dark:text-gray-200 dark:[&>option]:text-white dark:[&>option]:bg-neutral-700">
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

                    <label class="flex-1">
                        <input type="file" 
                               accept="audio/*" 
                               class="hidden" 
                               id="fileUpload">
                        <div class="w-full py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2 cursor-pointer">
                            <i class="ph ph-upload-simple text-xl text-white"></i>
                            <span id="uploadText" class="text-white" style="color: white;">Subir Gravação</span>
                        </div>
                    </label>
                </div>
            </form>
        </main>
    `;
} 