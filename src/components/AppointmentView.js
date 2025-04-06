export default function AppointmentView(appointment) {
    return `
        <main class="bg-white dark:bg-gray-800 form-container rounded-lg shadow-md p-6 mx-auto">
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                        ${appointment.template_type}
                    </h1>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                        ${new Date(appointment.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </div>

                <div class="space-y-2">
                    <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        Contexto do Paciente
                    </h2>
                    <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p class="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                            ${appointment.patient_context || 'Nenhum contexto fornecido'}
                        </p>
                    </div>
                </div>

                <div class="space-y-2">
                    <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        Gravação
                    </h2>
                    <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <audio controls class="w-full">
                            <source src="data:audio/wav;base64,${appointment.audio_file}" type="audio/wav">
                            Seu navegador não suporta o elemento de áudio.
                        </audio>
                    </div>
                </div>

                ${appointment.transcription ? `
                    <div class="space-y-2">
                        <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200">
                            Transcrição
                        </h2>
                        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p class="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                                ${appointment.transcription}
                            </p>
                        </div>
                    </div>
                ` : ''}

                ${appointment.generated_document ? `
                    <div class="space-y-2">
                        <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200">
                            Documento Gerado
                        </h2>
                        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p class="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                                ${appointment.generated_document}
                            </p>
                        </div>
                    </div>
                ` : ''}
            </div>
        </main>
    `;
} 