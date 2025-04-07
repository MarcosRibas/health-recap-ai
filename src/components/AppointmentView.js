export default function AppointmentView(appointment) {
    try {
        console.log('Iniciando geração do HTML do AppointmentView');
        console.log('Dados recebidos:', appointment);

        const html = `
            <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-6">
                <main class="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                    <div class="space-y-6">
                        <div class="flex justify-between items-center border-b pb-4">
                            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                                ${appointment.template_type || 'Sem título'}
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

                        <div class="space-y-4">
                            <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                Contexto do Paciente
                            </h2>
                            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p class="text-gray-700 dark:text-gray-200">
                                    ${appointment.patient_context || 'Nenhum contexto fornecido'}
                                </p>
                            </div>
                        </div>

                        <div class="space-y-4">
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

                        <div class="space-y-4">
                            <h2 class="text-xl font-bold text-red-600 dark:text-red-400">
                                DEBUG - Resposta do n8n
                            </h2>
                            <div class="p-4 bg-red-50 dark:bg-red-900 rounded-lg border-2 border-red-300 dark:border-red-700">
                                <pre class="text-red-700 dark:text-red-200 whitespace-pre-wrap">
A resposta do n8n foi:
${JSON.stringify(appointment.analysis, null, 2)}
                                </pre>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                Análise da Consulta
                            </h2>
                            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div class="prose dark:prose-invert max-w-none">
                                    ${appointment.analysis || 'Nenhuma análise disponível'}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;

        console.log('HTML gerado com sucesso no AppointmentView');
        return html;
    } catch (error) {
        console.error('Erro ao gerar HTML no AppointmentView:', error);
        throw error;
    }
} 