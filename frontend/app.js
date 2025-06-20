document.addEventListener('DOMContentLoaded', () => {
    const songList = document.getElementById('songList');
    const player = document.getElementById('player');
    const albumArt = document.getElementById('albumArt');
    const searchInput = document.getElementById('searchInput');
    const playPauseBtn = document.getElementById('playPause');
    const stopBtn = document.getElementById('stop');
    const rewindBtn = document.getElementById('rewind');

    let songs = [];
    let isPlaying = false;

    function renderSongs(filter = '') {
        songList.innerHTML = '';
        songs
            .filter(song => song.title.toLowerCase().includes(filter.toLowerCase()))
            .forEach(song => {
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
                    player.src = `/stream/${song.filename}`;
                    albumArt.src = song.artwork;
                    player.play();
                    isPlaying = true;
                    playPauseBtn.textContent = '⏸️';
                };
                songList.appendChild(card);
            });
    }

    fetch('/songs')
        .then(res => res.json())
        .then(data => {
            songs = data;
            renderSongs();
        });

    searchInput.addEventListener('input', (e) => {
        renderSongs(e.target.value);
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
