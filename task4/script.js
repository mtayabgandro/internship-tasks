document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const progressBar = document.getElementById('progress-bar');
    const volumeSlider = document.getElementById('volume-slider');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const songTitle = document.getElementById('song-title');
    const artistName = document.getElementById('artist-name');
    const albumCover = document.getElementById('album-cover');
    const playlistEl = document.getElementById('playlist');
    const albumArt = document.querySelector('.album-art');
    
    // Music Playlist with reliable audio sources
    const playlist = [
        {
            title: "Blinding Lights",
            artist: "The Weeknd",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            duration: "3:20"
        },
        {
            title: "Shape of You",
            artist: "Ed Sheeran",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            duration: "3:53"
        },
        {
            title: "Dance Monkey",
            artist: "Tones and I",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            duration: "3:29"
        },
        {
            title: "Save Your Tears",
            artist: "The Weeknd",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
            cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            duration: "3:35"
        },
        {
            title: "Stay",
            artist: "The Kid LAROI, Justin Bieber",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
            cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            duration: "2:21"
        }
    ];
    
    // Player State
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffled = false;
    let isRepeating = false;
    let originalPlaylist = [...playlist];
    
    // Format time (seconds to MM:SS)
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Load a song
    function loadSong(index) {
        const song = playlist[index];
        
        // Show loading state
        songTitle.textContent = "Loading...";
        
        audioPlayer.src = song.src;
        songTitle.textContent = song.title;
        artistName.textContent = song.artist;
        albumCover.src = song.cover;
        durationEl.textContent = song.duration;
        
        // Update active song in playlist
        updatePlaylistUI();
        
        // Reset progress bar
        progressBar.value = 0;
        currentTimeEl.textContent = "0:00";
        
        // If player was playing, continue playing
        if (isPlaying) {
            const playPromise = audioPlayer.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Auto-play prevented:", error);
                    isPlaying = false;
                    playIcon.classList.remove('fa-pause');
                    playIcon.classList.add('fa-play');
                    albumArt.classList.remove('playing');
                });
            }
        }
    }
    
    // Play/Pause functionality
    function togglePlayPause() {
        if (isPlaying) {
            audioPlayer.pause();
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
            albumArt.classList.remove('playing');
        } else {
            const playPromise = audioPlayer.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    playIcon.classList.remove('fa-play');
                    playIcon.classList.add('fa-pause');
                    albumArt.classList.add('playing');
                }).catch(error => {
                    console.log("Play failed:", error);
                    alert("Audio playback failed. Please check your internet connection or try a different browser.");
                });
            }
        }
        isPlaying = !isPlaying;
    }
    
    // Play next song
    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) {
            audioPlayer.play();
        }
    }
    
    // Play previous song
    function playPrevSong() {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) {
            audioPlayer.play();
        }
    }
    
    // Toggle shuffle
    function toggleShuffle() {
        isShuffled = !isShuffled;
        shuffleBtn.style.color = isShuffled ? '#ff7e5f' : 'white';
        
        if (isShuffled) {
            // Shuffle the playlist (Fisher-Yates algorithm)
            for (let i = playlist.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
            }
            currentSongIndex = playlist.findIndex(song => song.title === songTitle.textContent);
        } else {
            // Restore original order
            playlist.length = 0;
            playlist.push(...originalPlaylist);
            currentSongIndex = playlist.findIndex(song => song.title === songTitle.textContent);
        }
        
        updatePlaylistUI();
    }
    
    // Toggle repeat
    function toggleRepeat() {
        isRepeating = !isRepeating;
        repeatBtn.style.color = isRepeating ? '#ff7e5f' : 'white';
    }
    
    // Update progress bar
    function updateProgressBar() {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        
        if (duration && !isNaN(duration)) {
            const progressPercent = (currentTime / duration) * 100;
            progressBar.value = progressPercent;
            currentTimeEl.textContent = formatTime(currentTime);
        }
    }
    
    // Seek in song
    function seekSong() {
        const duration = audioPlayer.duration;
        if (duration && !isNaN(duration)) {
            const seekTime = (progressBar.value / 100) * duration;
            audioPlayer.currentTime = seekTime;
        }
    }
    
    // Update volume
    function updateVolume() {
        audioPlayer.volume = volumeSlider.value / 100;
    }
    
    // Update playlist UI
    function updatePlaylistUI() {
        playlistEl.innerHTML = '';
        
        playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = `playlist-item ${index === currentSongIndex ? 'active' : ''}`;
            li.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <div class="song-details">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
                <div class="song-duration">${song.duration}</div>
            `;
            
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                if (!isPlaying) {
                    togglePlayPause();
                }
            });
            
            playlistEl.appendChild(li);
        });
    }
    
    // Event Listeners
    playPauseBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', playNextSong);
    prevBtn.addEventListener('click', playPrevSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    
    progressBar.addEventListener('input', seekSong);
    volumeSlider.addEventListener('input', updateVolume);
    
    audioPlayer.addEventListener('timeupdate', updateProgressBar);
    audioPlayer.addEventListener('ended', () => {
        if (isRepeating) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            playNextSong();
        }
    });
    
    audioPlayer.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audioPlayer.duration);
    });
    
    audioPlayer.addEventListener('error', (e) => {
        console.error("Audio error:", e);
        songTitle.textContent = "Error loading audio";
        isPlaying = false;
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        albumArt.classList.remove('playing');
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case ' ':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowRight':
                if (e.ctrlKey) {
                    e.preventDefault();
                    playNextSong();
                }
                break;
            case 'ArrowLeft':
                if (e.ctrlKey) {
                    e.preventDefault();
                    playPrevSong();
                }
                break;
            case 'r':
            case 'R':
                if (e.ctrlKey) {
                    e.preventDefault();
                    toggleRepeat();
                }
                break;
            case 's':
            case 'S':
                if (e.ctrlKey) {
                    e.preventDefault();
                    toggleShuffle();
                }
                break;
        }
    });
    
    // Initialize
    originalPlaylist = [...playlist];
    updatePlaylistUI();
    loadSong(currentSongIndex);
    updateVolume(); // Set initial volume
    
    // Auto-play the first song after a short delay (with user interaction)
    document.addEventListener('click', function initAudio() {
        if (!isPlaying) {
            setTimeout(() => {
                togglePlayPause();
            }, 500);
        }
        document.removeEventListener('click', initAudio);
    });
});