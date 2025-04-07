import express from 'express';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Middleware para CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Middleware para processar JSON com limite aumentado
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

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

// Rota para buscar todas as consultas (lista resumida)
app.get('/api/appointments', (req, res) => {
    console.log('Recebida requisição para buscar consultas');
    
    const query = `
        SELECT id, template_type, created_at 
        FROM appointments 
        ORDER BY created_at DESC
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar consultas:', err);
            res.status(500).json({ error: 'Erro ao buscar consultas' });
            return;
        }
        
        console.log('Consultas encontradas:', rows);
        res.json(rows);
    });
});

// Rota para buscar uma consulta específica
app.get('/api/appointments/:id', (req, res) => {
    const query = `
        SELECT id, template_type, patient_context, audio_file, audio_filename, 
               transcription, generated_document, created_at, updated_at
        FROM appointments 
        WHERE id = ?
    `;
    
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            console.error('Erro ao buscar consulta:', err);
            res.status(500).json({ error: 'Erro ao buscar consulta' });
            return;
        }
        
        if (!row) {
            res.status(404).json({ error: 'Consulta não encontrada' });
            return;
        }
        
        res.json(row);
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
}); 