const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../db.json');

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
    const db = readDB();

    if (req.method === 'GET') {
        return res.json(db.groups);
    }

    if (req.method === 'POST') {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Group name is required' });
        }

        const newGroup = { id: Date.now(), name, messages: [] };
        db.groups.push(newGroup);
        writeDB(db);
        return res.json(newGroup);
    }

    res.status(405).json({ error: 'Method not allowed' });
}
