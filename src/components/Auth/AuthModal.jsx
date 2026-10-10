import React, { useState, useEffect } from 'react';
import './AuthModal.css';

// Pre-seeded accounts for demo & testing
const DEFAULT_ACCOUNTS = [
  {
    id: 'usr_rahul',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    password: 'password123',
    role: 'customer'
  },
  {
    id: 'usr_admin',
    name: 'Studio Admin',
    email: 'admin@finegiftstudio.com',
    phone: '+91 99999 88888',
    password: 'admin123',
    role: 'admin'
  }
];

export default function AuthModal({
  isOpen = false,
  onClose = () => {},
  initialTab = 'login', // 'login' | 'signup'
  onLoginSuccess = () => {},
  showToast = () => {}
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' | 'signup' | 'forgot'
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password visibility toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: true
  });

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Sync initialTab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setErrorMessage('');
      setSuccessMessage('');
      setForgotSent(false);
    }
  }, [isOpen, initialTab]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Retrieve or seed user database from localStorage
  const getRegisteredUsers = () => {
    try {
      const stored = localStorage.getItem('finegift_registered_users');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    // Seed default accounts
    localStorage.setItem('finegift_registered_users', JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS;
  };

  const saveRegisteredUsers = (users) => {
    try {
      localStorage.setItem('finegift_registered_users', JSON.stringify(users));
    } catch {}
  };

  // Evaluate password strength
  const getPasswordStrength = (pass) => {
    if (!pass) return { level: 0, label: 'Empty' };
    if (pass.length < 6) return { level: 1, label: 'Too short (min 6 chars)' };
    const hasNum = /\d/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    if (pass.length >= 8 && hasNum && hasSpecial) {
      return { level: 3, label: 'Strong' };
    }
    if (pass.length >= 6 && (hasNum || hasSpecial)) {
      return { level: 2, label: 'Medium' };
    }
    return { level: 1, label: 'Weak' };
  };

  // Handle Sign In submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const input = loginForm.emailOrPhone.trim().toLowerCase();
    const password = loginForm.password;

    if (!input) {
      setErrorMessage('Please enter your email or mobile number.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = getRegisteredUsers();
      const foundUser = users.find(
        (u) =>
          (u.email.toLowerCase() === input || u.phone.replace(/\s+/g, '') === input.replace(/\s+/g, '')) &&
          u.password === password
      );

      setIsLoading(false);

      if (foundUser) {
        const userSession = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          phone: foundUser.phone,
          role: foundUser.role || 'customer'
        };
        onLoginSuccess(userSession);
        showToast('success', 'Welcome Back!', `Signed in successfully as ${foundUser.name}.`);
        onClose();
      } else {
        setErrorMessage('Invalid email/mobile or password. Please verify credentials or use demo sign-in.');
      }
    }, 600);
  };

  // Handle Quick Demo Login
  const handleQuickDemoLogin = (accountType) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const targetUser = accountType === 'admin' ? DEFAULT_ACCOUNTS[1] : DEFAULT_ACCOUNTS[0];
      const userSession = {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        phone: targetUser.phone,
        role: targetUser.role
      };
      onLoginSuccess(userSession);
      showToast('success', 'Demo Sign-In', `Signed in as ${targetUser.name} (${targetUser.role}).`);
      onClose();
    }, 400);
  };

  // Handle Sign Up submission
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const name = signupForm.name.trim();
    const email = signupForm.email.trim().toLowerCase();
    const phone = signupForm.phone.trim();
    const password = signupForm.password;
    const confirmPassword = signupForm.confirmPassword;

    if (!name || name.length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (!signupForm.agreeTerms) {
      setErrorMessage('Please accept the Terms & Conditions to create an account.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = getRegisteredUsers();
      const existingUser = users.find((u) => u.email.toLowerCase() === email);

      if (existingUser) {
        setIsLoading(false);
        setErrorMessage('An account with this email already exists. Please sign in instead.');
        return;
      }

      const formattedPhone = phone.startsWith('+91') ? phone : `+91 ${phone.replace(/\D/g, '').slice(-10)}`;
      const newUser = {
        id: `usr_${Date.now()}`,
        name,
        email,
        phone: formattedPhone,
        password,
        role: 'customer',
        createdAt: new Date().toISOString()
      };

      const updatedUsers = [...users, newUser];
      saveRegisteredUsers(updatedUsers);

      const userSession = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: 'customer'
      };

      setIsLoading(false);
      onLoginSuccess(userSession);
      showToast('success', 'Account Created!', `Welcome to Fine Gift Studio, ${name}! Your ₹100 welcome credit is active.`);
      onClose();
    }, 700);
  };

  // Handle Forgot Password
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setErrorMessage('Please enter a valid registered email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotSent(true);
    }, 800);
  };

  const passwordStrength = getPasswordStrength(signupForm.password);

  return (
    <div
      className={`auth-modal-backdrop ${isOpen ? 'open' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="User Authentication Modal"
    >
      <div className="auth-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="auth-modal-close-btn"
          onClick={onClose}
          aria-label="Close Authentication Dialog"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Modal Header */}
        <div className="auth-modal-header">
          <div className="auth-brand-badge">
            <i className="fa-solid fa-crown"></i>
            <span>Fine Gift Studio</span>
          </div>

          {activeTab === 'login' && (
            <>
              <h2>Welcome Back</h2>
              <p>Sign in to access your orders, saved wishlists, and express checkout.</p>
            </>
          )}

          {activeTab === 'signup' && (
            <>
              <h2>Create an Account</h2>
              <p>Join our artisan gift community and unlock a ₹100 welcome voucher.</p>
            </>
          )}

          {activeTab === 'forgot' && (
            <>
              <h2>Reset Password</h2>
              <p>Enter your registered email and we'll send you a password recovery link.</p>
            </>
          )}
        </div>

        {/* Tabs Switcher (Visible in login & signup modes) */}
        {activeTab !== 'forgot' && (
          <div className="auth-tabs-nav" role="tablist">
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('login');
                setErrorMessage('');
              }}
            >
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
              <span>Sign In</span>
            </button>

            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('signup');
                setErrorMessage('');
              }}
            >
              <i className="fa-solid fa-user-plus"></i>
              <span>Create Account</span>
            </button>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="auth-modal-body">
          {/* Error Alert */}
          {errorMessage && (
            <div className="auth-alert error" role="alert">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="auth-alert success" role="status">
              <i className="fa-solid fa-circle-check"></i>
              <span>{successMessage}</span>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 1: SIGN IN                                          */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} noValidate>
              {/* Demo Account Chips for Quick Evaluation */}
              <div className="auth-demo-banner">
                <div className="auth-demo-label">
                  <span>Quick 1-Click Demo Login</span>
                  <i className="fa-solid fa-bolt" style={{ color: '#d4af37' }}></i>
                </div>
                <div className="auth-demo-chips">
                  <button
                    type="button"
                    className="auth-demo-chip"
                    onClick={() => handleQuickDemoLogin('customer')}
                    title="Sign in as Rahul Sharma"
                  >
                    <i className="fa-regular fa-user"></i>
                    <span>Demo Customer</span>
                  </button>

                  <button
                    type="button"
                    className="auth-demo-chip"
                    onClick={() => handleQuickDemoLogin('admin')}
                    title="Sign in as Store Admin"
                  >
                    <i className="fa-solid fa-shield-halved"></i>
                    <span>Store Admin</span>
                  </button>
                </div>
              </div>

              {/* Email or Phone Input */}
              <div className="auth-form-group">
                <label htmlFor="login-email">Email Address or Mobile</label>
                <div className="auth-input-wrapper">
                  <input
                    id="login-email"
                    type="text"
                    className="auth-input"
                    placeholder="e.g. rahul.sharma@example.com"
                    value={loginForm.emailOrPhone}
                    onChange={(e) => setLoginForm({ ...loginForm, emailOrPhone: e.target.value })}
                    required
                    autoComplete="username"
                  />
                  <i className="fa-regular fa-envelope auth-leading-icon"></i>
                </div>
              </div>

              {/* Password Input */}
              <div className="auth-form-group">
                <label htmlFor="login-password">Password</label>
                <div className="auth-input-wrapper">
                  <input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                    autoComplete="current-password"
                  />
                  <i className="fa-solid fa-lock auth-leading-icon"></i>
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`fa-regular ${showLoginPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="auth-helpers-row">
                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    checked={loginForm.rememberMe}
                    onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => {
                    setActiveTab('forgot');
                    setErrorMessage('');
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </>
                )}
              </button>

              <div className="auth-divider">
                <span>Or continue with</span>
              </div>

              <div className="auth-social-row">
                <button
                  type="button"
                  className="auth-social-btn"
                  onClick={() => handleQuickDemoLogin('customer')}
                >
                  <i className="fa-brands fa-google"></i>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="auth-social-btn"
                  onClick={() => handleQuickDemoLogin('customer')}
                >
                  <i className="fa-brands fa-apple"></i>
                  <span>Apple</span>
                </button>
              </div>

              {/* Switch to Signup */}
              <div className="auth-switch-prompt">
                <span>New to Fine Gift Studio?</span>{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setErrorMessage('');
                  }}
                >
                  Create an account
                </button>
              </div>
            </form>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 2: SIGN UP / CREATE ACCOUNT                         */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} noValidate>
              {/* Member Perks Row */}
              <div className="auth-perks-row">
                <div className="auth-perk-item">
                  <i className="fa-solid fa-gift"></i>
                  <span>₹100 Welcome Gift</span>
                </div>
                <div className="auth-perk-item">
                  <i className="fa-solid fa-truck-fast"></i>
                  <span>Free Shipping Perks</span>
                </div>
                <div className="auth-perk-item">
                  <i className="fa-solid fa-heart"></i>
                  <span>Saved Wishlists</span>
                </div>
              </div>

              {/* Full Name */}
              <div className="auth-form-group">
                <label htmlFor="signup-name">Full Name</label>
                <div className="auth-input-wrapper">
                  <input
                    id="signup-name"
                    type="text"
                    className="auth-input"
                    placeholder="e.g. Rahul Sharma"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    required
                  />
                  <i className="fa-regular fa-user auth-leading-icon"></i>
                </div>
              </div>

              {/* Email Address */}
              <div className="auth-form-group">
                <label htmlFor="signup-email">Email Address</label>
                <div className="auth-input-wrapper">
                  <input
                    id="signup-email"
                    type="email"
                    className="auth-input"
                    placeholder="name@example.com"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    required
                  />
                  <i className="fa-regular fa-envelope auth-leading-icon"></i>
                </div>
              </div>

              {/* Mobile Number */}
              <div className="auth-form-group">
                <label htmlFor="signup-phone">Mobile Number</label>
                <div className="auth-input-wrapper">
                  <input
                    id="signup-phone"
                    type="tel"
                    className="auth-input"
                    placeholder="e.g. 98765 43210"
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                    required
                  />
                  <i className="fa-solid fa-phone auth-leading-icon"></i>
                </div>
              </div>

              {/* Create Password */}
              <div className="auth-form-group">
                <label htmlFor="signup-password">Create Password</label>
                <div className="auth-input-wrapper">
                  <input
                    id="signup-password"
                    type={showSignupPassword ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="At least 6 characters"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    required
                  />
                  <i className="fa-solid fa-lock auth-leading-icon"></i>
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`fa-regular ${showSignupPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>

                {/* Password Strength Meter */}
                {signupForm.password && (
                  <div className="auth-strength-meter">
                    <div className="auth-strength-bars">
                      <div className={`auth-strength-bar ${passwordStrength.level >= 1 ? (passwordStrength.level === 1 ? 'weak' : passwordStrength.level === 2 ? 'medium' : 'strong') : ''}`}></div>
                      <div className={`auth-strength-bar ${passwordStrength.level >= 2 ? (passwordStrength.level === 2 ? 'medium' : 'strong') : ''}`}></div>
                      <div className={`auth-strength-bar ${passwordStrength.level >= 3 ? 'strong' : ''}`}></div>
                    </div>
                    <span className="auth-strength-text">Strength: {passwordStrength.label}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="auth-form-group">
                <label htmlFor="signup-confirm-password">Confirm Password</label>
                <div className="auth-input-wrapper">
                  <input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="Re-type password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    required
                  />
                  <i className="fa-solid fa-shield-halved auth-leading-icon"></i>
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="auth-helpers-row" style={{ marginBottom: '18px' }}>
                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    checked={signupForm.agreeTerms}
                    onChange={(e) => setSignupForm({ ...signupForm, agreeTerms: e.target.checked })}
                  />
                  <span style={{ fontSize: '12px' }}>
                    I agree to the <span style={{ color: '#b8005b', fontWeight: 600 }}>Terms of Service</span> &amp; <span style={{ color: '#b8005b', fontWeight: 600 }}>Privacy Policy</span>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account &amp; Claim ₹100 Off</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </>
                )}
              </button>

              {/* Switch to Login */}
              <div className="auth-switch-prompt">
                <span>Already have an account?</span>{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage('');
                  }}
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 3: FORGOT PASSWORD                                  */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'forgot' && (
            <div className="auth-forgot-view">
              {!forgotSent ? (
                <form onSubmit={handleForgotSubmit} noValidate>
                  <div className="auth-forgot-icon-wrap">
                    <i className="fa-solid fa-key"></i>
                  </div>

                  <div className="auth-form-group" style={{ textAlign: 'left' }}>
                    <label htmlFor="forgot-email">Registered Email Address</label>
                    <div className="auth-input-wrapper">
                      <input
                        id="forgot-email"
                        type="email"
                        className="auth-input"
                        placeholder="Enter your account email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        autoFocus
                      />
                      <i className="fa-regular fa-envelope auth-leading-icon"></i>
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                        <span>Sending reset link...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Password Reset Link</span>
                        <i className="fa-solid fa-paper-plane"></i>
                      </>
                    )}
                  </button>

                  <div className="auth-switch-prompt" style={{ marginTop: '20px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('login');
                        setErrorMessage('');
                      }}
                    >
                      <i className="fa-solid fa-arrow-left" style={{ marginRight: '4px' }}></i>
                      Back to Sign In
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="auth-forgot-success-box">
                    <i className="fa-solid fa-circle-check"></i>
                    <h4>Reset Link Sent!</h4>
                    <p>
                      We've sent a secure password recovery link to <strong>{forgotEmail}</strong>.
                      Please check your inbox to set a new password.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="auth-submit-btn"
                    onClick={() => {
                      setActiveTab('login');
                      setForgotSent(false);
                      setErrorMessage('');
                    }}
                  >
                    <span>Back to Sign In</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
