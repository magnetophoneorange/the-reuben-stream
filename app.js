document.addEventListener('DOMContentLoaded', () => {
    const songList = document.getElementById('songList');
    const player = document.getElementById('player');
    const albumArt = document.getElementById('albumArt');
    const currentTitle = document.getElementById('currentTrackTitle');
    const playPauseBtn = document.getElementById('playPause');
    const stopBtn = document.getElementById('stop');
    const rewindBtn = document.getElementById('rewind');

    let songs = [];
    let isPlaying = false;

    function renderSongs() {
        songList.innerHTML = '';
        songs.forEach(song => {
            const card = document.createElement('div');
            card.className = 'song-card';
            card.innerHTML = `
                <img src="${song.artwork}" alt="Art for ${song.title}">
                <div class="info">
                    <h3>${song.title}</h3>
                    <button>Play ▶️</button>
                </div>
            `;
            card.querySelector('button').onclick = () => {
                player.src = song.filename;
                albumArt.src = song.artwork;
                currentTitle.textContent = song.title;
                player.play();
                isPlaying = true;
                playPauseBtn.textContent = '⏸️';
            };
            songList.appendChild(card);
        });
    }

    fetch('songs.json')
        .then(res => res.json())
        .then(data => {
            songs = data;
            renderSongs();

            // Auto-play a random track
            const randomSong = songs[Math.floor(Math.random() * songs.length)];
            player.src = randomSong.filename;
            albumArt.src = randomSong.artwork;
            currentTitle.textContent = randomSong.title;
            player.play();
            isPlaying = true;
            playPauseBtn.textContent = '⏸️';
        });

    playPauseBtn.onclick = () => {
        if (isPlaying) {
            player.pause();
            playPauseBtn.textContent = '▶️';
        } else {
            player.play();
            playPauseBtn.textContent = '⏸️';
        }
        isPlaying = !isPlaying;
    };

    stopBtn.onclick = () => {
        player.pause();
        player.currentTime = 0;
        playPauseBtn.textContent = '▶️';
        isPlaying = false;
    };

    rewindBtn.onclick = () => {
        player.currentTime = 0;
    };
});