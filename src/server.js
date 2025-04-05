import express from 'express';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Configuração do banco de dados SQLite
const db = new sqlite3.Database('health.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados SQLite');
        
        // Criar tabela de consultas (appointments)
        db.run(`CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            template_type TEXT NOT NULL,
            patient_context TEXT,
            audio_file BLOB,
            audio_filename TEXT,
            transcription TEXT,
            generated_document TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Middleware para servir arquivos estáticos
app.use(express.static(join(__dirname)));
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// Rota para salvar uma consulta
app.post('/api/appointments', (req, res) => {
    const { template_type, patient_context, audio_file, audio_filename } = req.body;
    
    const query = `
        INSERT INTO appointments (
            template_type, 
            patient_context, 
            audio_file, 
            audio_filename
        ) VALUES (?, ?, ?, ?)
    `;
    
    db.run(query, [template_type, patient_context, audio_file, audio_filename], function(err) {
        if (err) {
            console.error('Erro ao salvar consulta:', err);
            res.status(500).json({ error: 'Erro ao salvar consulta' });
            return;
        }
        
        res.status(201).json({ 
            id: this.lastID,
            message: 'Consulta salva com sucesso' 
        });
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
}); 