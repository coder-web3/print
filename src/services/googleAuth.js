/**
 * Google Authentication Service for Fine Gift Studio
 * Handles Google Identity Services (GIS), JWT decoding, and OAuth2 popup flow.
 */

export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '638962899611-hdg22q7pa0i51ausjdo68s3cakmb7a5h.apps.googleusercontent.com';

/**
 * Safely decodes Google JWT credential ID token without external dependencies
 */
export function decodeGoogleJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding Google JWT credential:', error);
    return null;
  }
}

/**
 * Ensures Google Identity Services script is present and loaded in DOM
 */
export function loadGoogleGsiScript() {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      resolve(true);
      return;
    }
    const existing = document.getElementById('google-gsi-client-script');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-gsi-client-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

/**
 * Initializes Google Identity Services (One Tap and Button renderer)
 */
export function initializeGoogleIdentity({ onCredentialSuccess, onError }) {
  if (typeof window === 'undefined' || !window.google?.accounts?.id) return false;

  try {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        if (response?.credential) {
          const profile = decodeGoogleJwt(response.credential);
          if (profile) {
            onCredentialSuccess(profile);
          } else if (onError) {
            onError('Could not parse Google ID token.');
          }
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    return true;
  } catch (err) {
    console.warn('Google Identity initialization failed:', err);
    if (onError) onError(err);
    return false;
  }
}

/**
 * Renders official Google Sign-In / Sign-Up button into DOM container
 */
export function renderOfficialGoogleButton(containerElement, { text = 'signin_with', width = 320 } = {}) {
  if (typeof window === 'undefined' || !window.google?.accounts?.id || !containerElement) return false;

  try {
    containerElement.innerHTML = '';
    window.google.accounts.id.renderButton(containerElement, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      text: text, // 'signin_with' | 'signup_with' | 'continue_with'
      shape: 'rectangular',
      logo_alignment: 'left',
      width: Math.min(width, Math.max(containerElement.offsetWidth || 320, 240)),
    });
    return true;
  } catch (err) {
    console.warn('Error rendering official Google button:', err);
    return false;
  }
}

/**
 * Direct OAuth 2.0 Token Client popup authentication
 * Works reliably when clicked from custom buttons
 */
export function promptGoogleOAuthPopup({ onSuccess, onError }) {
  if (typeof window === 'undefined') return;

  if (!window.google?.accounts?.oauth2) {
    if (onError) {
      onError('Google Identity Services library is not loaded yet. Please check your connection.');
    }
    return;
  }

  try {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'email profile openid',
      callback: async (tokenResponse) => {
        if (tokenResponse && tokenResponse.access_token) {
          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });
            if (!res.ok) throw new Error(`Google API returned status ${res.status}`);
            const profile = await res.json();
            onSuccess(profile);
          } catch (fetchErr) {
            console.error('Error fetching Google user profile:', fetchErr);
            if (onError) onError('Could not retrieve user profile from Google.');
          }
        } else {
          if (onError) onError('Google authorization did not return an access token.');
        }
      },
      error_callback: (error) => {
        console.warn('Google OAuth popup returned error:', error);
        if (onError) {
          if (error?.type === 'popup_closed') {
            onError('Google Sign-In window was closed before completion.');
          } else {
            onError('Google Sign-In notice: Ensure http://localhost:3002 is listed under Authorized JavaScript origins in Google Cloud Console.');
          }
        }
      },
    });

    tokenClient.requestAccessToken({ prompt: 'select_account' });
  } catch (err) {
    console.error('Failed to trigger Google popup:', err);
    if (onError) onError(err.message || 'Google Sign-In initialization failed.');
  }
}
