import React, { useState, useEffect } from "react";
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
} from "react-icons/wi";
import { IoLocationSharp, IoSearchSharp } from "react-icons/io5";

// Weather icons configuration
const weatherIcons = [
  { icon: WiDaySunny, color: "text-yellow-400", condition: "Clear" },
  { icon: WiCloudy, color: "text-gray-300", condition: "Clouds" },
  { icon: WiRain, color: "text-blue-400", condition: "Rain" },
  { icon: WiSnow, color: "text-blue-100", condition: "Snow" },
  { icon: WiThunderstorm, color: "text-purple-400", condition: "Thunderstorm" },
];

const WeatherCheck = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [particles, setParticles] = useState([]);
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // Fetch weather data
  const getWeather = async (location) => {
    if (!location) return; // Don't fetch if no location is provided

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok)
        throw new Error("Location not found. Please try another city.");

      const data = await response.json();

      // Format the weather data
      const formattedData = {
        city: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        wind: (data.wind.speed * 3.6).toFixed(1),
        sunrise: formatTime(data.sys.sunrise),
        sunset: formatTime(data.sys.sunset),
        feelsLike: Math.round(data.main.feels_like),
      };

      setWeather(formattedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format time
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      getWeather(searchQuery);
    }
  };

  // Get the appropriate weather icon
  const getWeatherIcon = () => {
    const matchedIcon =
      weatherIcons.find((icon) => icon.condition === weather?.condition) ||
      weatherIcons[0];
    return matchedIcon.icon;
  };

  // Generate weather particles
  const generateParticles = () => {
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.2,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * 10,
      type: Math.random() > 0.3 ? "drop" : "flake",
    }));
    setParticles(newParticles);
  };

  // Initial particle generation
  useEffect(() => {
    generateParticles();
  }, []);

  const WeatherIcon = getWeatherIcon();
  const iconColor =
    weatherIcons.find((icon) => icon.condition === weather?.condition)?.color ||
    "text-yellow-400";

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Smooth gradient animation */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"
          style={{
            animation: "gradientShift 18s ease infinite",
            backgroundSize: "200% 200%",
          }}
        />

        {/* Floating particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full bg-white/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Weather Particles (Rain/Snow) */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${
            particle.type === "drop" ? "bg-blue-300/70" : "bg-white/80"
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `fall ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Search Section with enhanced styling */}
        <div className="w-full max-w-2xl text-center mb-12 animate-fade-in-down">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Weather<span className="text-teal-300">Vue</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 font-light">
            Real-Time Weather Intelligence & Forecasting
          </p>

          <form onSubmit={handleSearch} className="w-full max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter city name..."
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-4 px-6 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-lg transition-all duration-300 hover:bg-white/15"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-teal-500/80 hover:bg-teal-400/90 rounded-full p-3 transition-all duration-300 hover:scale-110"
                disabled={loading}
              >
                <IoSearchSharp className="w-6 h-6 text-white" />
              </button>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl w-full max-w-md flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl text-white/90">Fetching weather data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-8 border border-red-300/20 shadow-xl w-full max-w-md animate-shake">
            <p className="text-xl text-red-100 text-center">{error}</p>
          </div>
        )}

        {/* Weather Display */}
        {weather && !loading && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl w-full max-w-md transform transition-all duration-500 hover:scale-[1.02]">
            {/* Location and Date */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  {weather.city}, {weather.country}
                </h2>
                <p className="text-white/80 text-lg">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center text-white/80 bg-white/10 rounded-full px-3 py-1">
                <IoLocationSharp className="mr-2 text-teal-300" />
                <span className="font-medium">{weather.condition}</span>
              </div>
            </div>

            {/* Temperature */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="mr-4">
                  <WeatherIcon
                    className={`w-24 h-24 ${iconColor} drop-shadow-lg`}
                  />
                </div>
                <div>
                  <div className="text-6xl font-bold text-white">
                    {weather.temp}°C
                  </div>
                  <div className="text-white/80 text-lg">
                    Feels like {weather.feelsLike}°C
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-4">
              <WeatherDetail
                icon={<WiHumidity className="text-2xl text-blue-300" />}
                label="Humidity"
                value={`${weather.humidity}%`}
              />
              <WeatherDetail
                icon={<WiStrongWind className="text-2xl text-teal-300" />}
                label="Wind Speed"
                value={`${weather.wind} km/h`}
              />
              <WeatherDetail
                icon={<WiSunrise className="text-2xl text-yellow-300" />}
                label="Sunrise"
                value={weather.sunrise}
              />
              <WeatherDetail
                icon={<WiSunset className="text-2xl text-orange-300" />}
                label="Sunset"
                value={weather.sunset}
              />
            </div>
          </div>
        )}

        {/* Initial State - When no search has been made */}
        {!weather && !loading && !error && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl w-full max-w-md text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Welcome to WeatherVue
            </h2>
            <p className="text-white/80 text-lg mb-6">
              Enter a city name above to get current weather conditions and
              forecasts
            </p>
            <div className="flex justify-center">
              <WiDaySunny className="text-6xl text-yellow-300 animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Wave Animation */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-20"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-blue-500/30"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-teal-500/30"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-blue-500/40"
          />
        </svg>
      </div>

      {/* CSS Animations */}
      <style jsx="true">{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        @keyframes fall {
          0% {
            transform: translateY(-100vh);
          }
          100% {
            transform: translateY(100vh);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
        }
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

// Enhanced WeatherDetail component
const WeatherDetail = ({ icon, label, value }) => (
  <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300">
    <div className="flex items-center text-white/80 mb-1">
      <span className="mr-2">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
    <div className="text-2xl font-semibold text-white">{value}</div>
  </div>
);

export default WeatherCheck;
