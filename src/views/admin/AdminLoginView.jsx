import { useState, useRef, useEffect } from 'react';
import { adminLoginAPI } from '../../api-helpers/admin';

export default function AdminLoginView({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await adminLoginAPI({ username, password });
    setLoading(false);

    if (res.success) {
      // pass user info to caller if provided
      onSuccess?.(res.user || null);
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(168,85,247,.1)_25%,rgba(168,85,247,.1)_50%,transparent_50%,transparent_75%,rgba(168,85,247,.1)_75%,rgba(168,85,247,.1))] bg-[length:40px_40px] animate-pulse"></div>
      </div>

      {/* Floating orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "4s" }}></div>

      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-md"
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
      >
        {/* Spotlight effect */}
        {isFocused && (
          <div
            className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-75 animate-pulse"
            style={{
              background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(168,85,247,0.8), transparent 80%)`,
            }}
          ></div>
        )}

        {/* Card */}
        <div className="relative bg-slate-900 border border-purple-500/30 backdrop-blur-xl rounded-2xl p-8 shadow-2xl overflow-hidden">
          {/* Animated border */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="inline-block mb-4 p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                <svg
                  className="w-8 h-8 text-white animate-spin"
                  style={{ animationDuration: "3s" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-2">
                ADMIN
              </h1>
              <p className="text-sm text-gray-400 font-mono">
                &gt; ACCESS RESTRICTED ZONE
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition duration-300"></div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Admin username"
                  disabled={loading}
                  className="relative w-full px-4 py-3 bg-slate-800 border border-purple-500/30 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 font-mono"
                />
              </div>

              {/* Password */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition duration-300"></div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin password"
                  disabled={loading}
                  className="relative w-full px-4 py-3 pr-12 bg-slate-800 border border-purple-500/30 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-pink-400 transition-colors cursor-pointer"
                >
                  {showPassword ? '🔓' : '🔐'}
                </button>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg animate-bounce">
                  <p className="text-red-300 text-sm font-semibold flex items-center gap-2">
                    <span>⚠️</span>
                    {error}
                  </p>
                </div>
              )}

              {/* Submit button */}
              <button
                disabled={loading}
                type="submit"
                className="relative w-full group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/50"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                <div className="relative px-6 py-3 bg-slate-900 rounded-lg font-bold text-white flex items-center justify-center gap-2 group-hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50">
                    {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>AUTHENTICATING...</span>
                    </>
                  ) : (
                    <>
                      <span>GRANT ACCESS</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </div>
              </button>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-purple-500/20">
                <div className="text-center">
                  <div className="text-xs text-gray-500 font-mono">USERNAME</div>
                  <div className="text-lg font-bold text-purple-400">{username || '—'}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 font-mono">STATUS</div>
                  <div className="text-lg font-bold text-pink-400">{loading ? '🔄' : 'READY'}</div>
                </div>
              </div>
            </form>

            {/* Decorative elements */}
            <div className="mt-8 pt-6 border-t border-purple-500/20">
              <div className="text-xs text-gray-600 font-mono space-y-1">
                <div>&gt; System.Security.Enabled: true</div>
                <div>&gt; Encryption: AES-256</div>
                <div>&gt; Session: Secure</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}