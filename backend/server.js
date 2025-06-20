const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/album-art', express.static(path.join(__dirname, '../album-art')));

const MUSIC_DIR = path.join(__dirname, '../music');

app.get('/songs', (req, res) => {
    const files = fs.readdirSync(MUSIC_DIR).filter(file => file.endsWith('.mp3'));
    const songs = files.map(file => {
        const name = path.parse(file).name;
        return {
            filename: file,
            title: name.replace(/_/g, ' '),
            artwork: `/album-art/${name}.jpg`
        };
    });
    res.json(songs);
});

app.get('/stream/:filename', (req, res) => {
    const filePath = path.join(MUSIC_DIR, req.params.filename);
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });

        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'audio/mpeg',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'audio/mpeg',
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
});

app.listen(PORT, () => {
    console.log(`🎵 Music server running at http://localhost:${PORT}`);
});
