document.addEventListener('DOMContentLoaded', () => {
  const songList = document.getElementById('songList');
  const player = document.getElementById('player');
  const albumArt = document.getElementById('albumArt');
  const currentTrackTitle = document.getElementById('currentTrackTitle');
  const playPauseBtn = document.getElementById('playPause');
  const stopBtn = document.getElementById('stop');
  const rewindBtn = document.getElementById('rewind');
  const counterSpan = document.getElementById('counterDigits');

  let count = localStorage.getItem('reubenVisitorCount') || 1;
  counterSpan.textContent = String(count * 10).padStart(6, '0');
  localStorage.setItem('reubenVisitorCount', parseInt(count) + 1);

  fetch('songs.json')
    .then(res => res.json())
    .then(songs => {
      songs.forEach(song => {
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = \`
          <img src="\${song.artwork}" alt="Art for \${song.title}">
          <div class="info">
            <h3>\${song.title}</h3>
            <button>Play ▶️</button>
          </div>\`;
        card.querySelector('button').onclick = () => {
          player.src = song.filename;
          albumArt.src = song.artwork;
          currentTrackTitle.textContent = song.title;
          player.play();
          playPauseBtn.textContent = '⏸️';
        };
        songList.appendChild(card);
      });
    });

  let isPlaying = false;
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