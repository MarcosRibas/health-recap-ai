export class VolumeBars {
    constructor(container) {
        this.container = container;
        this.bars = [];
        this.createBars();
    }

    createBars() {
        // Limpa o container
        this.container.innerHTML = '';
        
        // Cria as barras
        for (let i = 0; i < 8; i++) {
            const bar = document.createElement('div');
            bar.className = 'volume-bar w-1 h-full bg-gray-200 rounded-sm transition-colors duration-100';
            this.bars.push(bar);
            this.container.appendChild(bar);
        }
    }

    updateVolume(volume) {
        // Normaliza o volume para 0-1 se necessário
        const normalizedVolume = Math.min(Math.max(volume, 0), 1);
        const activeCount = Math.floor(normalizedVolume * this.bars.length);
        
        this.bars.forEach((bar, index) => {
            if (index < activeCount) {
                bar.classList.add('active');
            } else {
                bar.classList.remove('active');
            }
        });
    }

    reset() {
        this.bars.forEach(bar => bar.classList.remove('active'));
    }
} 