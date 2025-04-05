// Função para enviar os dados da consulta para o servidor
export async function saveAppointment(audioBlob, audioFileName) {
    try {
        // Obtém os valores do formulário
        const templateSelect = document.querySelector('select');
        const patientContext = document.querySelector('textarea');
        
        // Converte o Blob de áudio para base64
        const base64Audio = await blobToBase64(audioBlob);
        
        // Prepara os dados para envio
        const appointmentData = {
            template_type: templateSelect.value,
            patient_context: patientContext.value,
            audio_file: base64Audio,
            audio_filename: audioFileName
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
        alert('Consulta salva com sucesso!');
        
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