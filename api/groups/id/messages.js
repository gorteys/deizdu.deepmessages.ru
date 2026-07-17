const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../../db.json');

function readDB() {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], groups: [] }));
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
    const { id } = req.query;
    const db = readDB();
    const group = db.groups.find(g => g.id === parseInt(id));

    if (!group) {
        return res.status(404).json({ error: 'Group not found' });
    }

    if (req.method === 'GET') {
        return res.json(group.messages);
    }

    if (req.method === 'POST') {
        const { sender, text, file } = req.body;
        if (!sender) {
            return res.status(400).json({ error: 'Sender is required' });
        }

        const msg = {
            id: Date.now(),
            sender,
            text: text || '',
            time: new Date().toLocaleTimeString(),
            file: file || null
        };
        group.messages.push(msg);
        writeDB(db);
        return res.json(msg);
    }

    res.status(405).json({ error: 'Method not allowed' });
}
