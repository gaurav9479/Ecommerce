import React from 'react';
import { useTheme } from '../Context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const ThemePage = () => {
  const { theme, setTheme, themes } = useTheme();
  const navigate = useNavigate();

  const handleThemeSelect = (selectedThemeId) => {
    setTheme(selectedThemeId);
    // Optional: Navigate back or show success message
    // navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
            Choose Your Theme
          </h1>
          <p className="text-slate-400 text-lg">
            Personalize your shopping experience with one of our curated themes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {themes.map((t) => (
            <div
              key={t.id}
              onClick={() => handleThemeSelect(t.id)}
              className={`relative cursor-pointer group rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
                theme === t.id 
                  ? 'ring-4 ring-offset-4 ring-offset-slate-900 ring-purple-500 scale-105' 
                  : 'border border-slate-700 hover:border-purple-500/50'
              }`}
            >
              {/* Theme Preview Block */}
              <div 
                className="h-32 w-full transition-transform duration-500 group-hover:scale-110"
                style={{ 
                  background: t.id === 'theme-classic' ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' :
                              t.id === 'theme-dark'    ? 'linear-gradient(135deg, #94a3b8, #1e293b)' :
                              t.id === 'theme-ocean'   ? 'linear-gradient(135deg, #0ea5e9, #06b6d4)' :
                              t.id === 'theme-sunset'  ? 'linear-gradient(135deg, #f97316, #dc2626)' :
                              'linear-gradient(135deg, #10b981, #047857)' 
                }}
              />
              
              <div className="p-6 bg-slate-800/50 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                    {t.name}
                  </h3>
                  {theme === t.id && (
                    <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm">
                  {t.id === 'theme-classic' ? 'Vibrant purple and pink gradients.' :
                   t.id === 'theme-dark'    ? 'Sleek monochrome dark mode.' :
                   t.id === 'theme-ocean'   ? 'Calming deep sea blue tones.' :
                   t.id === 'theme-sunset'  ? 'Warm energy of the evening sun.' :
                   'Refreshing natural green vibes.'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
            <button 
                onClick={() => navigate('/')}
                className="px-8 py-3 rounded-lg font-semibold border border-slate-600 text-slate-300 hover:bg-slate-800 transition-all duration-300"
            >
                Back to Home
            </button>
        </div>
      </div>
    </div>
  );
};

export default ThemePage;
