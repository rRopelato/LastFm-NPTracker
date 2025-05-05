const API_KEY = 'i will not share my api key here lol';
const USERNAME = 'Ropelato';
const API_URL = 'https://ws.audioscrobbler.com/2.0/';

async function fetchLastFmPlaying() {
    try {
        const response = await fetch(`${API_URL}?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`);
        const data = await response.json();
        
        if (data.recenttracks && data.recenttracks.track) {
            const track = data.recenttracks.track[0];
            displayTrackInfo(track);
        }
    } catch (error) {
        console.error('Error to fetch data from Last.fm:', error);
        document.getElementById('track-content').innerHTML = '<p>Error to load music data</p>';
    }
}

async function fetchProfileInfo() {
    try {
        const response = await fetch(`${API_URL}?method=user.getinfo&user=${USERNAME}&api_key=${API_KEY}&format=json`);
        const data = await response.json();

        if (data.user) {
            displayProfileInfo(data.user);
        }
    } catch (error) {
        console.error('Error to load profile content:', error);
        document.getElementById('profile-content').innerHTML = '<p>Error to load profile content</p>';
    }
}

function displayTrackInfo(track) {
    const trackContent = document.getElementById('track-content');
    const isNowPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';
    
    const trackHtml = `
        <div class="track-info">
            <img src="${track.image[2]['#text']}" alt="Album Cover" class="track-image">
            <div class="track-details">
                <div class="track-name">
                    ${track.name}
                    ${isNowPlaying ? '<span class="now-playing-indicator">• Now playing</span>' : ''}
                </div>
                <div class="artist-name">${track.artist['#text']}</div>
                <div class="album-name">${track.album['#text']}</div>
            </div>
        </div>
    `;
    
    trackContent.innerHTML = trackHtml;
}

function displayProfileInfo(user) {
    const profileContent = document.getElementById('profile-content');
    const userImage = (user.image && user.image.length > 0) ? (user.image.find(img => img.size === 'large')?.['#text'] || user.image[0]['#text']) : '';
    const profileHtml = `
        <div class="profile-info-card profile-info-with-photo">
            <img src="${userImage}" alt="Profile Picture" class="profile-photo">
            <div class="profile-info-data">
                <div class="profile-info-row">
                    <div class="profile-info-item">
                        <span class="icon">👤</span>
                        <span>${user.name}</span>
                    </div>
                    <div class="profile-info-item">
                        <span class="icon">🎵</span>
                        <span>${user.playcount} Listened songs</span>
                    </div>
                </div>
                <div class="profile-info-row">
                    <div class="profile-info-item">
                        <span class="icon">📅</span>
                        <span>Member since ${new Date(user.registered.unixtime * 1000).toLocaleDateString('en-US')}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    profileContent.innerHTML = profileHtml;
}

// refresh every 30 seconds
fetchLastFmPlaying();
fetchProfileInfo();
setInterval(fetchLastFmPlaying, 30000);