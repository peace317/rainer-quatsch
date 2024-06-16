const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

function importJsonFile(filePath) {
    const collectionName = path.basename(filePath, '.json');
    // uri must stand in quotes or special signs will be interpreted by whatever you are running mongoimport in
    const command = `mongoimport --uri "${process.env.DATABASE_URL}" --collection ${collectionName} --file ${filePath} --mode upsert --jsonArray `;
    try {
        execSync(command, { stdio: 'inherit' });
        console.log(`Import erfolgreich: ${filePath}`);
    } catch (error) {
        console.error(`Import fehlgeschlagen: ${filePath}`);
        console.error(error.message);
    }
}

function importJsonFilesInDirectory(directoryPath) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Fehler beim Lesen des Verzeichnisses:', err);
            return;
        }
        files.forEach(file => {
            const filePath = path.join(directoryPath, file);
            if (path.extname(filePath) === '.json') {
                importJsonFile(filePath);
            }
        });
    });
}

importJsonFilesInDirectory(__dirname + '/ruletables');