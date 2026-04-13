
const devEmail = import.meta.env.VITE_DEV_USER_EMAIL || 'dev@jurni.local';
const mockUser = {
    id: 'dev-user',
    username: 'dev-user',
    firstName: 'Dev',
    lastName: 'User',
    fullName: 'Dev User',
    imageUrl: '',
    primaryEmailAddress: { emailAddress: devEmail },
    publicMetadata: { role: 'admin' },
};

function noopAsync() {
    return Promise.resolve();
}

export function ClerkProvider({ children }) {
    return <>{children}</>;
}

export function SignedIn({ children }) {
    return <>{children}</>;
}

export function SignedOut() {
    return null;
}

export function UserButton() {
    return (
        <div
            aria-label="dev-user"
            className="w-8 h-8 rounded-full bg-orange-accent text-white flex items-center justify-center text-xs font-semibold"
            title={mockUser.fullName}
        >
            DU
        </div>
    );
}

export function useUser() {
    return {
        isLoaded: true,
        isSignedIn: true,
        user: mockUser,
    };
}

export function useAuth() {
    return {
        isLoaded: true,
        isSignedIn: true,
        userId: mockUser.id,
        sessionId: 'dev-session',
        getToken: async () => import.meta.env.VITE_DEV_JWT_TOKEN || 'dev-jwt-token',
        signOut: noopAsync,
    };
}

export function useSignIn() {
    return {
        isLoaded: true,
        signIn: {
            create: async () => ({ status: 'complete', createdSessionId: 'dev-session' }),
            authenticateWithRedirect: noopAsync,
        },
        setActive: noopAsync,
    };
}

export function useSignUp() {
    return {
        isLoaded: true,
        signUp: {
            status: 'missing_requirements',
            createdSessionId: 'dev-session',
            create: noopAsync,
            prepareEmailAddressVerification: noopAsync,
            attemptEmailAddressVerification: async () => ({ status: 'complete', createdSessionId: 'dev-session' }),
            authenticateWithRedirect: noopAsync,
        },
        setActive: noopAsync,
    };
}
