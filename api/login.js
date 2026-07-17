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
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const db = readDB();
    let user = db.users.find(u => u.name === name);
    if (!user) {
        user = { name, createdAt: new Date().toISOString() };
        db.users.push(user);
        writeDB(db);
    }

    res.json({ success: true, user });
}
