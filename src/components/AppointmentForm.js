export default async function AppointmentForm() {
    try {
        const response = await fetch('/src/components/AppointmentForm.html');
        const template = await response.text();
        return template;
    } catch (error) {
        console.error('Erro ao carregar o template do formulário:', error);
        return '<div class="text-red-500">Erro ao carregar o formulário</div>';
    }
} 