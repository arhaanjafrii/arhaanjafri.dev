import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const DISCORD_ID = '819731408444063755';
const LANYARD_API = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;

function MainPage() {
  const [time, setTime] = useState('');
  const [spotify, setSpotify] = useState(null);
  const [discordStatus, setDiscordStatus] = useState('offline');
  const [firstSpotifyLoad, setFirstSpotifyLoad] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'America/Chicago',
      };
      setTime(now.toLocaleTimeString('en-US', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchLanyard = async () => {
    try {
      const res = await fetch(LANYARD_API);
      const data = await res.json();
      setSpotify(data.data.spotify);
      setDiscordStatus(data.data.discord_status);
      setFirstSpotifyLoad(false);
    } catch (e) {
      setSpotify(null);
      setDiscordStatus('offline');
      setFirstSpotifyLoad(false);
    }
  };

  useEffect(() => {
    fetchLanyard();
    const interval = setInterval(fetchLanyard, 10000);
    return () => clearInterval(interval);
  }, []);

  const isOnline = ['online', 'idle', 'dnd'].includes(discordStatus);
  const discordStatusText = isOnline ? 'online' : 'offline';

  return (
    <div className="container">
      <h1 className="greeting superbold">Hey, I'm Arhaan. <span className="wave" role="img" aria-label="wave">👋</span></h1>
      <div className="desc">
        <p>I'm a highschooler in Austin, Texas. I'm big into robotics. Check out my projects <Link to="/projects/" className="link slightbold">here</Link>!</p>
        <p style={{marginTop: '1.3em'}}>I am the founder of <a href="https://cirkit.crazeddd.dev/" target="_blank" rel="noopener noreferrer" className="link slightbold">CirKit</a>, a service that delivers projects to your doorstep, designed by students, for students.</p>
      </div>
      <div className="time-status">
        It's currently <span>{time}</span> for me, and I'm <span className={isOnline ? 'discord-online' : 'discord-offline'}>{discordStatusText}</span> on Discord.
      </div>
      <div className="spotify-section">
        <div className="spotify-label">Listening to Spotify</div>
        {spotify ? (
          <div className="spotify-card">
            <img className="album-art" src={spotify.album_art_url} alt="Album Art" />
            <div className="track-info">
              <div className="track-name single-line">{spotify.song}</div>
              <div className="track-artist greyed">{spotify.artist}</div>
            </div>
          </div>
        ) : (
          <div className="spotify-card empty">Not listening to Spotify right now:( </div>
        )}
      </div>
      <div className="contact-section">
        <div className="contact-title">Contact me!</div>
        <ul className="contact-list">
          <li><a href="http://discord.com/users/819731408444063755" className="link slightbold" target="_blank" rel="noopener noreferrer">@watermeloncarnivore</a> on discord</li>
          <li><a href="mailto:arhaan.jafri@gmail.com" className="link slightbold" target="_blank" rel="noopener noreferrer">arhaan.jafri@gmail.com</a> on email</li>
          <li><a href="https://instagram.com/arhaanjafrii" className="link slightbold" target="_blank" rel="noopener noreferrer">@arhaanjafrii</a> on instagram</li>
        </ul>
      </div>
      <div className="copyright">© 2025</div>
    </div>
  );
}

function ProjectsPage() {
  return (
    <div className="container">
      <h1 className="greeting superbold">Projects <span className="robot" role="img" aria-label="robot">🤖</span></h1>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/projects/" element={<ProjectsPage />} />
        <Route path="*" element={<MainPage />} />
      </Routes>
    </Router>
  );
}
