import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

const DISCORD_ID = '819731408444063755';
const LANYARD_API = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;

function MainPage() {
  const [time, setTime] = useState('');
  const [spotify, setSpotify] = useState(null);
  const [discordStatus, setDiscordStatus] = useState('offline');
  const [showSleepTip, setShowSleepTip] = useState(false);
  const [isSleepTime, setIsSleepTime] = useState(false);
  const [showStatusTip, setShowStatusTip] = useState(false);

  useEffect(() => {
    document.title = 'home | arhaan jafri';
  }, []);

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
      // Check if between 1:30am and 9am
      let hour = now.toLocaleString('en-US', { hour: '2-digit', hour12: true, timeZone: 'America/Chicago' });
      let minute = now.toLocaleString('en-US', { minute: '2-digit', timeZone: 'America/Chicago' });
      let ampm = now.toLocaleString('en-US', { hour: '2-digit', hour12: true, timeZone: 'America/Chicago' }).includes('AM');
      hour = parseInt(hour, 10);
      minute = parseInt(minute, 10);
      let isSleep = false;
      if (ampm) {
        if (hour === 12) hour = 0; // 12am is 0
        const totalMinutes = hour * 60 + minute;
        if (totalMinutes >= 90 && totalMinutes < 540) { // 1:30am (90) to 9:00am (540)
          isSleep = true;
        }
      }
      setIsSleepTime(isSleep);
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
    } catch (e) {
      setSpotify(null);
      setDiscordStatus('offline');
    }
  };

  useEffect(() => {
    fetchLanyard();
    const interval = setInterval(fetchLanyard, 10000);
    return () => clearInterval(interval);
  }, []);

  const isOnline = ['online', 'idle', 'dnd'].includes(discordStatus);
  const discordStatusText = isOnline ? 'online' : 'offline';

  let statusTip = null;
  if (discordStatus === 'dnd') {
    statusTip = (
      <span className="status-tooltip">
        but i am on <span className="discord-dnd">do not disturb</span>
      </span>
    );
  } else if (discordStatus === 'idle') {
    statusTip = (
      <span className="status-tooltip">
        but i am <span className="discord-idle">idle</span>
      </span>
    );
  }

  return (
    <div className="container">
      <h1 className="greeting superbold">
        Hey, I'm Arhaan. <i className="fa-solid fa-heart heart-icon" style={{ color: '#B197FC' }}></i>
      </h1>
      <div className="desc">
        <p>I'm a high school student based in Austin, Texas with a strong passion for robotics. You can check out my projects <Link to="/projects/" className="link slightbold">here</Link>!</p>
        <p style={{marginTop: '1.3em'}}>I am the founder of <a href="https://cirkit.crazeddd.dev/" target="_blank" rel="noopener noreferrer" className="link slightbold">CirKit</a>, a service that delivers hands-on hardware and electronics kits to your doorstep — designed by students, for students.</p>
      </div>
      <div className="time-status">
        It's currently <span
          className="time-tooltip-anchor"
          onMouseEnter={() => setShowSleepTip(true)}
          onMouseLeave={() => setShowSleepTip(false)}
          style={{ position: 'relative', cursor: isSleepTime ? 'pointer' : 'default' }}
        >
          {time}
          {isSleepTime && showSleepTip && (
            <span className="sleep-tooltip">im probably sleeping right now 😴</span>
          )}
        </span> for me, and I'm <span
          className={isOnline ? 'discord-online' : 'discord-offline'}
          onMouseEnter={() => setShowStatusTip(true)}
          onMouseLeave={() => setShowStatusTip(false)}
          style={{ position: 'relative', cursor: (discordStatus === 'dnd' || discordStatus === 'idle') ? 'pointer' : 'default' }}
        >
          {discordStatusText}
          {(showStatusTip && statusTip) && statusTip}
        </span>.
      </div>
      <div className="spotify-section">
        {spotify && <div className="spotify-label">Listening to Spotify</div>}
        {spotify ? (
          <div className="spotify-card">
            <img className="album-art" src={spotify.album_art_url} alt="Album Art" />
            <div className="track-info">
              <div className="track-name single-line">{spotify.song}</div>
              <div className="track-artist greyed">{spotify.artist}</div>
              <SpotifyProgressBar spotify={spotify} />
            </div>
          </div>
        ) : (
          <div className="spotify-card empty">Not listening to Spotify currently</div>
        )}
      </div>
      <div className="contact-section">
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
  useEffect(() => {
    document.title = 'projects | arhaan jafri';
  }, []);
  const [showSoonTip, setShowSoonTip] = useState(false);
  return (
    <div className="container">
      <h1
        className="greeting superbold soon-anchor"
        style={{textAlign: 'left', position: 'relative', width: 'fit-content'}}
        onMouseEnter={() => setShowSoonTip(true)}
        onMouseLeave={() => setShowSoonTip(false)}
      >
        Coming soon... <i className="fa-solid fa-code" style={{ color: '#B197FC' }}></i>
        {showSoonTip && (
          <span className="soon-tooltip">jk im gonna procrastinate this</span>
        )}
      </h1>
    </div>
  );
}

function SpotifyProgressBar({ spotify }) {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);
  if (!spotify.timestamps) return null;
  const start = spotify.timestamps.start;
  const end = spotify.timestamps.end;
  const duration = end - start;
  const elapsed = Math.min(now - start, duration);
  const percent = Math.max(0, Math.min(1, elapsed / duration));
  const format = ms => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };
  return (
    <div className="spotify-progress">
      <div className="bar-bg">
        <div className="bar-fg" style={{ width: `${percent * 100}%` }} />
      </div>
      <div className="bar-times">
        <span>{format(elapsed)}</span>
        <span>{format(duration)}</span>
      </div>
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
