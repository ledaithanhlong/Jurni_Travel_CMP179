import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './routes/App.jsx';
import './styles.css';

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const hasClerk = Boolean(clerkKey && clerkKey !== 'your_clerk_publishable_key');

async function render() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  if (hasClerk) {
    const { ClerkProvider } = await import('@clerk/clerk-react');
    root.render(
      <React.StrictMode>
        <ClerkProvider 
          publishableKey={clerkKey} 
          signInUrl="/sign-in" 
          signUpUrl="/sign-up"
          afterSignInUrl="/"
          afterSignUpUrl="/"
          verificationFallbackRedirectUrl="/sign-up/verify-email-address"
          appearance={{
            variables: {
              colorPrimary: '#1e3a8a',
              colorText: '#1f2937',
              colorTextSecondary: '#6b7280',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            },
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-lg',
              headerTitle: 'text-blue-dark',
              headerSubtitle: 'text-gray-600',
              socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50',
              formButtonPrimary: 'bg-blue-dark hover:bg-blue-dark/90 text-white shadow-md',
              footerActionLink: 'text-orange-accent hover:text-orange-hover',
            }
          }}
        >
          <BrowserRouter>
            <App clerkEnabled={true} />
          </BrowserRouter>
        </ClerkProvider>
      </React.StrictMode>
    );
  } else {
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App clerkEnabled={false} />
        </BrowserRouter>
      </React.StrictMode>
    );
  }
}

render();

