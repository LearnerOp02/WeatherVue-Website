import React, { useState, useEffect, useRef } from "react";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiStrongWind,
  WiHumidity,
  WiSunrise,
  WiSunset,
  WiFog,
  WiDayHaze,
} from "react-icons/wi";
import { IoLocationSharp, IoSearchSharp } from "react-icons/io5";

// ─── Weather theme configs ────────────────────────────────────────────────────
const WEATHER_THEMES = {
  Clear: {
    bg: "from-[#0f2942] via-[#1a4a7a] to-[#f97316]",
    accent: "#fbbf24",
    accentText: "text-amber-300",
    particle: "sun",
    label: "Clear Skies",
  },
  Clouds: {
    bg: "from-[#1e2a3a] via-[#3d5166] to-[#6b7f94]",
    accent: "#94a3b8",
    accentText: "text-slate-300",
    particle: "cloud",
    label: "Overcast",
  },
  Rain: {
    bg: "from-[#0d1b2a] via-[#1a3349] to-[#2c4e6e]",
    accent: "#60a5fa",
    accentText: "text-blue-300",
    particle: "rain",
    label: "Rainy",
  },
  Drizzle: {
    bg: "from-[#0d1b2a] via-[#1a3349] to-[#2c4e6e]",
    accent: "#93c5fd",
    accentText: "text-blue-200",
    particle: "drizzle",
    label: "Drizzly",
  },
  Snow: {
    bg: "from-[#1a2740] via-[#2d3f5a] to-[#8ba7c2]",
    accent: "#e0f2fe",
    accentText: "text-sky-100",
    particle: "snow",
    label: "Snowing",
  },
  Thunderstorm: {
    bg: "from-[#0a0a14] via-[#1a1a2e] to-[#2d1b4e]",
    accent: "#a78bfa",
    accentText: "text-violet-300",
    particle: "storm",
    label: "Thunderstorm",
  },
  Mist: {
    bg: "from-[#1a2033] via-[#2d3a4a] to-[#5a6a7a]",
    accent: "#cbd5e1",
    accentText: "text-slate-200",
    particle: "fog",
    label: "Misty",
  },
  Fog: {
    bg: "from-[#1a2033] via-[#2d3a4a] to-[#5a6a7a]",
    accent: "#cbd5e1",
    accentText: "text-slate-200",
    particle: "fog",
    label: "Foggy",
  },
  Haze: {
    bg: "from-[#2a1f0f] via-[#3d3020] to-[#7a6040]",
    accent: "#fcd34d",
    accentText: "text-yellow-200",
    particle: "haze",
    label: "Hazy",
  },
};

const getTheme = (condition) =>
  WEATHER_THEMES[condition] || WEATHER_THEMES["Clear"];

// ─── Particle Canvas ──────────────────────────────────────────────────────────
const ParticleCanvas = ({ condition }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animRef = useRef(null);
  const lightningRef = useRef({ active: false, opacity: 0, timer: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    // Build particles per condition
    const buildParticles = () => {
      particlesRef.current = [];
      if (condition === "Clear") {
        // Sun rays
        for (let i = 0; i < 8; i++) {
          particlesRef.current.push({
            type: "ray",
            angle: (i / 8) * Math.PI * 2,
            len: 60 + Math.random() * 40,
            speed: 0.002 + Math.random() * 0.002,
            opacity: 0.15 + Math.random() * 0.1,
          });
        }
        // Floating sparkles
        for (let i = 0; i < 60; i++) {
          particlesRef.current.push({
            type: "sparkle",
            x: Math.random() * W(),
            y: Math.random() * H(),
            size: 1 + Math.random() * 2,
            speed: 0.2 + Math.random() * 0.3,
            drift: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.6 + 0.2,
            phase: Math.random() * Math.PI * 2,
          });
        }
      } else if (condition === "Rain" || condition === "Drizzle") {
        const count = condition === "Rain" ? 180 : 90;
        for (let i = 0; i < count; i++) {
          particlesRef.current.push({
            type: "raindrop",
            x: Math.random() * W(),
            y: Math.random() * H(),
            len: condition === "Rain" ? 15 + Math.random() * 20 : 8 + Math.random() * 10,
            speed: condition === "Rain" ? 8 + Math.random() * 6 : 4 + Math.random() * 3,
            opacity: 0.3 + Math.random() * 0.4,
            width: condition === "Rain" ? 1.5 : 0.8,
          });
        }
      } else if (condition === "Snow") {
        for (let i = 0; i < 120; i++) {
          particlesRef.current.push({
            type: "snowflake",
            x: Math.random() * W(),
            y: Math.random() * H(),
            size: 2 + Math.random() * 5,
            speed: 0.5 + Math.random() * 1.5,
            drift: (Math.random() - 0.5) * 0.8,
            opacity: 0.5 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.02,
          });
        }
      } else if (condition === "Thunderstorm") {
        // Rain + lightning
        for (let i = 0; i < 200; i++) {
          particlesRef.current.push({
            type: "raindrop",
            x: Math.random() * W(),
            y: Math.random() * H(),
            len: 20 + Math.random() * 25,
            speed: 12 + Math.random() * 8,
            opacity: 0.4 + Math.random() * 0.4,
            width: 1.5,
          });
        }
      } else if (condition === "Clouds") {
        for (let i = 0; i < 30; i++) {
          particlesRef.current.push({
            type: "mote",
            x: Math.random() * W(),
            y: Math.random() * H(),
            size: 1 + Math.random() * 2,
            speed: 0.1 + Math.random() * 0.2,
            opacity: Math.random() * 0.3 + 0.1,
            phase: Math.random() * Math.PI * 2,
          });
        }
      } else if (condition === "Mist" || condition === "Fog") {
        for (let i = 0; i < 50; i++) {
          particlesRef.current.push({
            type: "mist",
            x: Math.random() * W(),
            y: 0.3 * H() + Math.random() * 0.6 * H(),
            radius: 60 + Math.random() * 120,
            speed: 0.1 + Math.random() * 0.2,
            opacity: 0.03 + Math.random() * 0.06,
            phase: Math.random() * Math.PI * 2,
          });
        }
      } else if (condition === "Haze") {
        for (let i = 0; i < 40; i++) {
          particlesRef.current.push({
            type: "haze",
            x: Math.random() * W(),
            y: Math.random() * H(),
            radius: 80 + Math.random() * 160,
            speed: 0.05 + Math.random() * 0.1,
            opacity: 0.02 + Math.random() * 0.04,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    buildParticles();

    // Lightning state
    let lightningTimer = 0;
    const triggerLightning = () => {
      lightningRef.current = { active: true, opacity: 1, timer: 0 };
    };

    const drawLightning = (ctx, W, H) => {
      const startX = W * 0.3 + Math.random() * W * 0.4;
      const startY = 0;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      let x = startX;
      let y = startY;
      const segments = 8 + Math.floor(Math.random() * 6);
      for (let i = 0; i < segments; i++) {
        x += (Math.random() - 0.5) * 80;
        y += H / segments;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(220, 200, 255, ${lightningRef.current.opacity})`;
      ctx.lineWidth = 2 + Math.random() * 2;
      ctx.shadowColor = "rgba(200, 180, 255, 0.8)";
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    let t = 0;
    const animate = () => {
      ctx.clearRect(0, 0, W(), H());
      t += 1;

      // Sun halo for Clear
      if (condition === "Clear") {
        const cx = W() * 0.78, cy = H() * 0.15;
        const pulse = 1 + 0.04 * Math.sin(t * 0.025);
        // Outer glow
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 160 * pulse);
        grad.addColorStop(0, "rgba(255,200,50,0.18)");
        grad.addColorStop(0.5, "rgba(255,160,30,0.07)");
        grad.addColorStop(1, "rgba(255,120,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 160 * pulse, 0, Math.PI * 2);
        ctx.fill();
        // Sun disc
        const discGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
        discGrad.addColorStop(0, "rgba(255,235,100,0.55)");
        discGrad.addColorStop(1, "rgba(255,180,30,0)");
        ctx.fillStyle = discGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 40, 0, Math.PI * 2);
        ctx.fill();
      }

      // Thunder lightning
      if (condition === "Thunderstorm") {
        lightningTimer++;
        const interval = 90 + Math.random() * 120;
        if (lightningTimer > interval) {
          triggerLightning();
          lightningTimer = 0;
        }
        if (lightningRef.current.active) {
          drawLightning(ctx, W(), H());
          lightningRef.current.opacity -= 0.07;
          if (lightningRef.current.opacity <= 0) lightningRef.current.active = false;
        }
      }

      // Particles
      particlesRef.current.forEach((p) => {
        if (p.type === "raindrop") {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 1, p.y + p.len);
          ctx.strokeStyle = `rgba(147, 210, 255, ${p.opacity})`;
          ctx.lineWidth = p.width;
          ctx.stroke();
          p.y += p.speed;
          if (p.y > H() + p.len) {
            p.y = -p.len;
            p.x = Math.random() * W();
          }
        } else if (p.type === "snowflake") {
          p.phase += 0.02;
          p.rotation += p.rotSpeed;
          const drift = Math.sin(p.phase) * p.drift;
          p.x += drift;
          p.y += p.speed;
          if (p.y > H() + 10) { p.y = -10; p.x = Math.random() * W(); }
          if (p.x < 0) p.x = W();
          if (p.x > W()) p.x = 0;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.strokeStyle = `rgba(220, 240, 255, ${p.opacity})`;
          ctx.lineWidth = 1;
          for (let arm = 0; arm < 6; arm++) {
            ctx.save();
            ctx.rotate((arm * Math.PI) / 3);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, p.size);
            ctx.moveTo(0, p.size * 0.4);
            ctx.lineTo(p.size * 0.2, p.size * 0.6);
            ctx.moveTo(0, p.size * 0.4);
            ctx.lineTo(-p.size * 0.2, p.size * 0.6);
            ctx.stroke();
            ctx.restore();
          }
          ctx.restore();
        } else if (p.type === "sparkle") {
          p.phase += 0.03;
          p.y -= p.speed;
          p.x += p.drift;
          const twinkle = Math.abs(Math.sin(p.phase)) * p.opacity;
          if (p.y < -5) { p.y = H() + 5; p.x = Math.random() * W(); }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 235, 150, ${twinkle})`;
          ctx.fill();
        } else if (p.type === "mote") {
          p.phase += 0.01;
          p.x += p.speed;
          if (p.x > W()) p.x = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180,200,220,${p.opacity + 0.1 * Math.sin(p.phase)})`;
          ctx.fill();
        } else if (p.type === "mist" || p.type === "haze") {
          p.phase += 0.005;
          p.x += p.speed;
          if (p.x > W() + p.radius) p.x = -p.radius;
          const color = condition === "Haze"
            ? `rgba(200,160,80,${p.opacity + 0.015 * Math.sin(p.phase)})`
            : `rgba(200,210,220,${p.opacity + 0.015 * Math.sin(p.phase)})`;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          grad.addColorStop(0, color);
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [condition]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

// ─── Weather icon map ─────────────────────────────────────────────────────────
const ICON_MAP = {
  Clear: { Icon: WiDaySunny, color: "#fbbf24" },
  Clouds: { Icon: WiCloudy, color: "#94a3b8" },
  Rain: { Icon: WiRain, color: "#60a5fa" },
  Drizzle: { Icon: WiRain, color: "#93c5fd" },
  Snow: { Icon: WiSnow, color: "#e0f2fe" },
  Thunderstorm: { Icon: WiThunderstorm, color: "#a78bfa" },
  Mist: { Icon: WiFog, color: "#cbd5e1" },
  Fog: { Icon: WiFog, color: "#cbd5e1" },
  Haze: { Icon: WiDayHaze, color: "#fcd34d" },
};
const getIcon = (condition) => ICON_MAP[condition] || ICON_MAP["Clear"];

// ─── Detail Card ──────────────────────────────────────────────────────────────
const DetailCard = ({ icon, label, value, accent }) => (
  <div
    className="rounded-2xl p-4 transition-all duration-300"
    style={{
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      backdropFilter: "blur(10px)",
    }}
  >
    <div className="flex items-center gap-2 mb-1" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
      <span style={{ color: accent }}>{icon}</span>
      {label}
    </div>
    <div className="text-white font-semibold text-xl">{value}</div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const WeatherCheck = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const formatTime = (ts) =>
    new Date(ts * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const getWeather = async (location) => {
    if (!location) return;
    setLoading(true);
    setError(null);
    setCardVisible(false);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
      );
      if (!res.ok) throw new Error("City not found — try another name.");
      const data = await res.json();
      setWeather({
        city: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        wind: (data.wind.speed * 3.6).toFixed(1),
        sunrise: formatTime(data.sys.sunrise),
        sunset: formatTime(data.sys.sunset),
        feelsLike: Math.round(data.main.feels_like),
      });
      setTimeout(() => setCardVisible(true), 80);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) getWeather(searchQuery.trim());
  };

  const theme = weather ? getTheme(weather.condition) : getTheme("Clear");
  const { Icon, color: iconColor } = weather ? getIcon(weather.condition) : getIcon("Clear");
  const condition = weather?.condition || "Clear";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        * { box-sizing: border-box; }

        body {
          margin: 0;
          font-family: 'Outfit', sans-serif;
        }

        .weather-root {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          transition: background 1.8s cubic-bezier(0.4,0,0.2,1);
        }

        .bg-layer {
          position: absolute;
          inset: 0;
          transition: opacity 1.8s ease;
        }

        /* Noise texture overlay */
        .noise-layer {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          z-index: 2;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .content-layer {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }

        /* Header animation */
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .anim-slide-down {
          animation: slideDown 0.9s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        .anim-fade-up {
          animation: fadeUp 0.8s ease forwards;
          opacity: 0;
        }
        .anim-scale-in {
          animation: scaleIn 0.7s cubic-bezier(0.34,1.2,0.64,1) forwards;
        }

        /* Search bar */
        .search-wrap {
          position: relative;
          width: 100%;
          max-width: 440px;
          margin: 0 auto;
        }
        .search-input {
          width: 100%;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 50px;
          padding: 1rem 4rem 1rem 1.5rem;
          color: white;
          font-size: 1rem;
          font-family: 'Outfit', sans-serif;
          font-weight: 400;
          outline: none;
          transition: border 0.3s, background 0.3s, box-shadow 0.3s;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.45); }
        .search-input:focus {
          border-color: rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.15);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.08);
        }
        .search-btn {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s;
        }
        .search-btn:hover { transform: translateY(-50%) scale(1.12); }
        .search-btn:active { transform: translateY(-50%) scale(0.95); }

        /* Weather card */
        .weather-card {
          width: 100%;
          max-width: 460px;
          border-radius: 28px;
          padding: 2rem;
          background: rgba(255,255,255,0.09);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.15);
          box-shadow:
            0 32px 80px rgba(0,0,0,0.35),
            0 0 0 1px rgba(255,255,255,0.05) inset,
            0 1px 0 rgba(255,255,255,0.15) inset;
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.2,0.64,1);
        }

        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 52px; height: 52px;
          border-radius: 50%;
          border: 3px solid rgba(255,255,255,0.12);
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        /* Error shake */
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-6px); }
          40%,80% { transform: translateX(6px); }
        }
        .shake { animation: shake 0.4s ease; }

        /* Temperature pulse */
        @keyframes tempPulse {
          0%,100% { opacity: 1; }
          50% { opacity: 0.85; }
        }

        /* Condition badge */
        .condition-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 50px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.85);
          text-transform: capitalize;
        }

        /* Bottom horizon glow */
        .horizon-glow {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 220px;
          pointer-events: none;
          z-index: 3;
          transition: background 1.8s ease;
        }

        /* Grid detail cards */
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 1.5rem;
        }

        /* Logo text */
        .logo-word {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: clamp(2.4rem, 6vw, 3.5rem);
          color: white;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .divider {
          width: 40px;
          height: 2px;
          margin: 1rem auto;
          border-radius: 2px;
          background: rgba(255,255,255,0.3);
        }

        @keyframes iconFloat {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        .icon-float { animation: iconFloat 4s ease-in-out infinite; }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <div
        className="weather-root"
        style={{
          background:
            condition === "Clear"
              ? "linear-gradient(160deg, #0c1e35 0%, #1a4a7a 50%, #c2440a 100%)"
              : condition === "Clouds"
              ? "linear-gradient(160deg, #1e2a3a 0%, #3d5166 55%, #6b7f94 100%)"
              : condition === "Rain" || condition === "Drizzle"
              ? "linear-gradient(160deg, #0d1b2a 0%, #1a3349 50%, #2c4e6e 100%)"
              : condition === "Snow"
              ? "linear-gradient(160deg, #1a2740 0%, #2d3f5a 50%, #8ba7c2 100%)"
              : condition === "Thunderstorm"
              ? "linear-gradient(160deg, #070712 0%, #1a1a2e 50%, #2d1b4e 100%)"
              : condition === "Mist" || condition === "Fog"
              ? "linear-gradient(160deg, #1a2033 0%, #2d3a4a 55%, #5a6a7a 100%)"
              : condition === "Haze"
              ? "linear-gradient(160deg, #2a1f0f 0%, #3d3020 55%, #7a6040 100%)"
              : "linear-gradient(160deg, #0c1e35 0%, #1a4a7a 50%, #c2440a 100%)",
        }}
      >
        {/* Noise texture */}
        <div className="noise-layer" />

        {/* Particle canvas */}
        <ParticleCanvas condition={condition} />

        {/* Horizon glow */}
        <div
          className="horizon-glow"
          style={{
            background:
              condition === "Clear"
                ? "linear-gradient(to top, rgba(249,115,22,0.25), transparent)"
                : condition === "Thunderstorm"
                ? "linear-gradient(to top, rgba(109,40,217,0.3), transparent)"
                : condition === "Snow"
                ? "linear-gradient(to top, rgba(186,230,253,0.15), transparent)"
                : condition === "Haze"
                ? "linear-gradient(to top, rgba(251,191,36,0.2), transparent)"
                : "linear-gradient(to top, rgba(255,255,255,0.05), transparent)",
          }}
        />

        {/* Content */}
        <div className="content-layer">

          {/* Header */}
          <div
            className={`text-center mb-10 ${mounted ? "anim-slide-down" : ""}`}
            style={{ opacity: mounted ? undefined : 0 }}
          >
            <div className="logo-word">
              Weather<span style={{ color: theme.accent }}>Vue</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", marginTop: "0.5rem", letterSpacing: "0.05em" }}>
              Real-time atmospheric intelligence
            </p>
            <div className="divider" />

            {/* Search */}
            <form onSubmit={handleSearch} className="search-wrap" style={{ marginTop: "1.5rem" }}>
              <input
                className="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search a city…"
              />
              <button
                type="submit"
                className="search-btn"
                disabled={loading}
                style={{ background: theme.accent, opacity: loading ? 0.6 : 1 }}
              >
                <IoSearchSharp size={18} color="#000" />
              </button>
            </form>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div className="spinner" />
              <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Space Mono', monospace", fontSize: "0.85rem" }}>
                fetching weather…
              </p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div
              className="shake weather-card"
              style={{
                maxWidth: 420,
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                textAlign: "center",
                padding: "1.5rem 2rem",
              }}
            >
              <p style={{ color: "#fca5a5", margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Weather card */}
          {weather && !loading && (
            <div
              className="weather-card anim-scale-in"
              style={{
                opacity: cardVisible ? 1 : 0,
                transform: cardVisible ? "scale(1) translateY(0)" : "scale(0.94) translateY(16px)",
              }}
            >
              {/* Top row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <div>
                  <h2 style={{ color: "white", margin: 0, fontSize: "1.6rem", fontWeight: 700, lineHeight: 1.1 }}>
                    {weather.city}
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px", color: "rgba(255,255,255,0.55)", fontSize: "0.9rem" }}>
                    <IoLocationSharp style={{ color: theme.accent }} size={14} />
                    {weather.country}
                  </div>
                </div>
                <div className="condition-badge">
                  {weather.description}
                </div>
              </div>

              {/* Temp + icon */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <div>
                  <div style={{
                    fontSize: "clamp(3.5rem, 10vw, 5rem)",
                    fontWeight: 800,
                    color: "white",
                    lineHeight: 1,
                    fontFamily: "'Outfit', sans-serif",
                    letterSpacing: "-0.03em",
                  }}>
                    {weather.temp}°
                    <span style={{ fontSize: "2rem", color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>C</span>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginTop: "4px" }}>
                    Feels like <span style={{ color: "rgba(255,255,255,0.75)" }}>{weather.feelsLike}°C</span>
                  </div>
                </div>
                <div className="icon-float">
                  <Icon style={{ fontSize: "6rem", color: iconColor, filter: `drop-shadow(0 0 20px ${iconColor}88)` }} />
                </div>
              </div>

              {/* Thin separator */}
              <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "1.25rem 0" }} />

              {/* Detail grid */}
              <div className="detail-grid">
                <DetailCard
                  icon={<WiHumidity size={22} />}
                  label="Humidity"
                  value={`${weather.humidity}%`}
                  accent={theme.accent}
                />
                <DetailCard
                  icon={<WiStrongWind size={22} />}
                  label="Wind"
                  value={`${weather.wind} km/h`}
                  accent={theme.accent}
                />
                <DetailCard
                  icon={<WiSunrise size={22} />}
                  label="Sunrise"
                  value={weather.sunrise}
                  accent={theme.accent}
                />
                <DetailCard
                  icon={<WiSunset size={22} />}
                  label="Sunset"
                  value={weather.sunset}
                  accent={theme.accent}
                />
              </div>

              {/* Date footer */}
              <div style={{ textAlign: "center", marginTop: "1.25rem", color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Space Mono', monospace" }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!weather && !loading && !error && (
            <div
              className={`weather-card ${mounted ? "anim-fade-up" : ""}`}
              style={{ opacity: mounted ? undefined : 0, textAlign: "center", animationDelay: "0.3s" }}
            >
              <div className="icon-float" style={{ display: "inline-block", marginBottom: "1rem" }}>
                <WiDaySunny style={{ fontSize: "5rem", color: "#fbbf24", filter: "drop-shadow(0 0 20px rgba(251,191,36,0.6))" }} />
              </div>
              <h3 style={{ color: "white", margin: "0 0 0.5rem", fontSize: "1.3rem", fontWeight: 600 }}>Welcome to WeatherVue</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", margin: 0, fontSize: "0.95rem", lineHeight: 1.6 }}>
                Search any city above to see live conditions, feels-like temperature, wind, humidity, and sun times.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WeatherCheck;