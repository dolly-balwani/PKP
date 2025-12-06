import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, UserCog, Mail, Lock, Heart, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [userType, setUserType] = useState('user'); // 'user' or 'counsellor'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }

    // Use navigate() for client-side routing
    if (userType === 'user') {
      navigate('/dashboard');
    } else { // userType is 'counsellor'
      navigate('/counsellor');
    }
  };

  const UserTypeToggle = () => (
    <div className="bg-[#f2f7eb] p-1 rounded-full flex w-full max-w-sm mx-auto mb-8">
      <button
        onClick={() => setUserType('user')}
        className={`w-1/2 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
          userType === 'user' ? 'bg-white text-[#2e2f34] shadow-md' : 'text-[#767272]'
        }`}
      >
        <User className="w-4 h-4" />
        <span>User</span>
      </button>
      <button
        onClick={() => setUserType('counsellor')}
        className={`w-1/2 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
          userType === 'counsellor' ? 'bg-white text-[#2e2f34] shadow-md' : 'text-[#767272]'
        }`}
      >
        <UserCog className="w-4 h-4" />
        <span>Counsellor</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#eaf1f5] flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="bg-[#3d9098] p-2 rounded-xl">
              <Heart className="w-8 h-8 text-white" />
          </div>
          <div>
              <h1 className="text-3xl font-bold text-[#2e2f34]">Sahay</h1>
              <p className="text-[#8d949d]">Your Mental Wellness Companion</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border" style={{borderColor:'#c8ced1'}}>
          <UserTypeToggle />

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#2e2f34]">
              Welcome Back
            </h2>
            <p className="text-[#767272]">
              Please sign in to your {userType === 'user' ? 'user' : 'counsellor'} account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2e2f34] mb-2">
                {userType === 'user' ? 'Email Address' : 'Professional Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8d949d]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={userType === 'user' ? 'your.email@example.com' : 'counsellor@clinic.com'}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2dc8ca] focus:border-transparent"
                  style={{borderColor:'#c8ced1'}}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2e2f34] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8d949d]" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2dc8ca] focus:border-transparent"
                  style={{borderColor:'#c8ced1'}}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-[#2dc8ca] focus:ring-[#3d9098] rounded" style={{borderColor:'#c8ced1'}} />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-[#2e2f34]">Remember me</label>
                </div>

                <div className="text-sm">
                    <a href="/forgot-password" className="font-medium text-[#2dc8ca] hover:underline">Forgot your password?</a>
                </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-100 p-3 rounded-lg text-center">{error}</p>
            )}

            <div>
              <button
                type="submit"
                className="w-full bg-[#2dc8ca] text-white py-3 px-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <LogIn className="w-6 h-6" />
                <span>Sign In</span>
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-[#767272]">
            {userType === 'user' ? "Don't have an account?" : "Haven't registered as a counsellor?"}{' '}
            <a href={userType === 'user' ? '/register-user' : '/register-counsellor'} className="font-medium text-[#2dc8ca] hover:underline">
              Register here
              <ArrowRight className="inline ml-1 w-4 h-4"/>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}