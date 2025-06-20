document.addEventListener('DOMContentLoaded', () => {
    const songList = document.getElementById('songList');
    const player = document.getElementById('player');
    const albumArt = document.getElementById('albumArt');
    const playPauseBtn = document.getElementById('playPause');
    const stopBtn = document.getElementById('stop');
    const rewindBtn = document.getElementById('rewind');
   // Fancy graphical visitor counter
const counterDisplay = document.getElementById('counterDigits');
let count = localStorage.getItem('reubenVisitorCount') || 1;
const digits = String(count).padStart(6, '0').split('');

digits.forEach(d => {
    const digit = document.createElement('span');
    digit.className = 'digit';
    digit.textContent = d;
    counterDisplay.appendChild(digit);
});

localStorage.setItem('reubenVisitorCount', parseInt(count) + 1);

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

        // Autoplay a random track
        const randomSong = songs[Math.floor(Math.random() * songs.length)];
        player.src = `/stream/${randomSong.filename}`;
        albumArt.src = randomSong.artwork;
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
