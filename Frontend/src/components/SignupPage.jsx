import React, { useState } from 'react';
import { 
  Heart, Mail, Lock, User, Eye, EyeOff, 
  CheckCircle, AlertCircle, Shield, Loader2
} from 'lucide-react';

export default function UserSignup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    ageConfirmation: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.ageConfirmation) {
      newErrors.ageConfirmation = 'You must confirm you are 18 or older';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and privacy policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      console.log('Submitting signup data:', {
        fullName: formData.fullName,
        email: formData.email
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSubmitting) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return '#ef4444';
    if (passwordStrength <= 3) return '#f59e0b';
    return '#10b981';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#eaf1f5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in border" style={{borderColor:'#c8ced1'}}>
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-[#2e2f34] mb-4">Welcome to Sahay!</h2>
          <p className="text-[#767272] mb-6">
            Your account has been created successfully. We've sent a verification email to <strong>{formData.email}</strong>
          </p>
          <p className="text-sm text-[#8d949d] mb-8">
            Please check your inbox and verify your email to get started.
          </p>
          <a href="/login" className="bg-[#2dc8ca] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 w-full block">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eaf1f5] font-sans p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2e2f34]">User Registration</h1>
          <p className="text-[#767272]">Create your Sahay account for mental wellness support.</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 border" style={{borderColor:'#c8ced1'}}>
          <div className="space-y-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-[#2e2f34] mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                onKeyPress={handleKeyPress}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2dc8ca] focus:border-transparent ${errors.fullName ? 'border-red-500' : ''}`}
                style={{borderColor: errors.fullName ? '#ef4444' : '#c8ced1'}}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#2e2f34] mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onKeyPress={handleKeyPress}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2dc8ca] focus:border-transparent ${errors.email ? 'border-red-500' : ''}`}
                style={{borderColor: errors.email ? '#ef4444' : '#c8ced1'}}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#2e2f34] mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2dc8ca] focus:border-transparent ${errors.password ? 'border-red-500' : ''}`}
                  style={{borderColor: errors.password ? '#ef4444' : '#c8ced1'}}
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d949d] hover:text-[#2e2f34]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#767272]">Password strength:</span>
                    <span className="text-xs font-medium" style={{ color: getPasswordStrengthColor() }}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor()
                      }}
                    />
                  </div>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#2e2f34] mb-2">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2dc8ca] focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  style={{borderColor: errors.confirmPassword ? '#ef4444' : '#c8ced1'}}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d949d] hover:text-[#2e2f34]"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Age Confirmation */}
            <div className="bg-[#eaf1f5] p-4 rounded-lg">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.ageConfirmation}
                  onChange={(e) => handleInputChange('ageConfirmation', e.target.checked)}
                  className="h-4 w-4 mt-1 text-[#2dc8ca] focus:ring-[#3d9098] rounded"
                  style={{borderColor:'#c8ced1'}}
                />
                <span className="ml-2 text-sm text-[#2e2f34]">
                  I confirm that I am 18 years of age or older *
                </span>
              </label>
              {errors.ageConfirmation && <p className="text-red-500 text-sm mt-1">{errors.ageConfirmation}</p>}
            </div>

            {/* Terms and Privacy */}
            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  className="h-4 w-4 mt-1 text-[#2dc8ca] focus:ring-[#3d9098] rounded"
                  style={{borderColor:'#c8ced1'}}
                />
                <span className="ml-2 text-sm text-[#2e2f34]">
                  I agree to the <a href="/terms" target="_blank" className="font-medium text-[#2dc8ca] hover:underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="font-medium text-[#2dc8ca] hover:underline">Privacy Policy</a>. *
                </span>
              </label>
              {errors.acceptTerms && <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>}
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Your Privacy Matters</p>
                <p className="text-blue-800">
                  All your data is encrypted and confidential. We never share your personal information without your consent.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t" style={{borderColor:'#c8ced1'}}>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 disabled:opacity-70 disabled:cursor-wait transition-all duration-300 flex items-center justify-center space-x-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-6 h-6" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-[#767272]">
                Already have an account?{' '}
                <a href="/login" className="text-[#2dc8ca] hover:underline font-semibold">
                  Log in here
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Crisis Support */}
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-sm text-red-900">
            <strong>In Crisis?</strong> If you're experiencing a mental health emergency, please call{' '}
            <a href="tel:988" className="font-bold underline">988</a> (Suicide & Crisis Lifeline) immediately.
          </p>
        </div>
      </div>
    </div>
  );
}