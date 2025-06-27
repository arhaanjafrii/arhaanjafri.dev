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
  const [spotifyTilt, setSpotifyTilt] = useState({ x: 0, y: 0, shadow: '' });
  const [isSpotifyHovered, setIsSpotifyHovered] = useState(false);
  const [isSpotifyEmptyHovered, setIsSpotifyEmptyHovered] = useState(false);

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
      // check if between 2:00am and 10am
      let hour = now.toLocaleString('en-US', { hour: '2-digit', hour12: true, timeZone: 'America/Chicago' });
      let minute = now.toLocaleString('en-US', { minute: '2-digit', timeZone: 'America/Chicago' });
      let ampm = now.toLocaleString('en-US', { hour: '2-digit', hour12: true, timeZone: 'America/Chicago' }).includes('AM');
      hour = parseInt(hour, 10);
      minute = parseInt(minute, 10);
      let isSleep = false;
      if (ampm) {
        if (hour === 12) hour = 0; 
        const totalMinutes = hour * 60 + minute;
        if (totalMinutes >= 120 && totalMinutes < 600) { 
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
        Hey! I'm Arhaan. <i className="fa-solid fa-heart heart-icon" style={{ color: '#B197FC' }}></i>
      </h1>
      <div className="desc">
        <p>High school student in Austin, Texas focused on robotics and mechatronics. Check out my projects <Link to="/projects/" className="link slightbold">here</Link>!</p>
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
          {!isSleepTime && showSleepTip && (
            <span className="sleep-tooltip">im probably awake, feel free to contact!</span>
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
        {spotify && <div className="spotify-label">Listening to Spotify<i className="fa-brands fa-spotify" style={{ color: '#888', marginLeft: '0.4em', position: 'relative', top: '0px' }}></i></div>}
        {spotify ? (
          <div
            className="spotify-card"
            style={{
              position: 'relative',
              overflow: 'hidden',
              transform: `perspective(600px) rotateY(${spotifyTilt.x}deg) rotateX(${spotifyTilt.y}deg) scale(1.03)` ,
              boxShadow: isSpotifyHovered
                ? `${-spotifyTilt.x * 2}px ${12 + spotifyTilt.y * 2}px 32px 0 rgba(255,255,255,0.04)`
                : 'none',
            }}
            onMouseMove={e => {
              const card = e.currentTarget;
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const maxTilt = 12;
              const safeX = Math.max(0, Math.min(rect.width, x));
              const safeY = Math.max(0, Math.min(rect.height, y));
              const tiltX = ((safeX - centerX) / centerX) * maxTilt;
              const tiltY = -((safeY - centerY) / centerY) * maxTilt;
              setSpotifyTilt({
                x: tiltX.toFixed(2),
                y: tiltY.toFixed(2),
                shadow: 'none'
              });
            }}
            onMouseEnter={() => setIsSpotifyHovered(true)}
            onMouseLeave={() => {
              setSpotifyTilt({ x: 0, y: 0, shadow: '' });
              setIsSpotifyHovered(false);
            }}
          >
            <div
              className="spotify-bg-art"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                backgroundImage: `url('${spotify.album_art_url}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: isSpotifyHovered ? 'blur(0px) saturate(1.2)' : 'blur(12px) saturate(1.2)',
                opacity: 0.2,
                transition: 'filter 0.3s, opacity 0.3s'
              }}
            />
            <div className="track-info">
              <div className="track-name single-line">{spotify.song}</div>
              <div className="track-artist greyed">{spotify.artist}</div>
              <SpotifyProgressBar spotify={spotify} />
            </div>
          </div>
        ) : (
          <div
            className="spotify-card empty"
            style={{
              position: 'relative',
              overflow: 'hidden',
              transform: `perspective(600px) rotateY(${spotifyTilt.x}deg) rotateX(${spotifyTilt.y}deg) scale(1.03)` ,
              boxShadow: isSpotifyEmptyHovered
                ? `${-spotifyTilt.x * 2}px ${12 + spotifyTilt.y * 2}px 32px 0 rgba(255,255,255,0.09)`
                : 'none',
              minHeight: 70,
              display: 'flex',
              alignItems: 'center',
              fontStyle: 'italic',
              color: '#555',
              fontSize: '1.05rem',
              fontWeight: 500
            }}
            onMouseMove={e => {
              const card = e.currentTarget;
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const maxTilt = 12;
              const safeX = Math.max(0, Math.min(rect.width, x));
              const safeY = Math.max(0, Math.min(rect.height, y));
              const tiltX = ((safeX - centerX) / centerX) * maxTilt;
              const tiltY = -((safeY - centerY) / centerY) * maxTilt;
              setSpotifyTilt({
                x: tiltX.toFixed(2),
                y: tiltY.toFixed(2),
                shadow: 'none'
              });
            }}
            onMouseEnter={() => setIsSpotifyEmptyHovered(true)}
            onMouseLeave={() => {
              setSpotifyTilt({ x: 0, y: 0, shadow: '' });
              setIsSpotifyEmptyHovered(false);
            }}
          >
            Not listening to Spotify currently
          </div>
        )}
      </div>
      <div className="contact-section">
        <ul className="contact-list">
          <li><a href="http://discord.com/users/819731408444063755" className="link slightbold" target="_blank" rel="noopener noreferrer">@watermeloncarnivore</a> on discord</li>
          <li><a href="mailto:arhaan.jafri@gmail.com" className="link slightbold" target="_blank" rel="noopener noreferrer">arhaan.jafri@gmail.com</a> on email</li>
          <li><a href="https://instagram.com/arhaanjafrii" className="link slightbold" target="_blank" rel="noopener noreferrer">@arhaanjafrii</a> on instagram</li>
        </ul>
      </div>
      <div className="copyright">
        <span className="copyright-inner">
          <span className="copyright-symbol">©</span> 2025
          <img
            src="/arhaanjafrilogo.png"
            alt="Arhaan Jafri Logo"
            className="copyright-logo"
          />
        </span>
      </div>
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
