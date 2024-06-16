import { withAuth } from 'next-auth/middleware';

export default withAuth({
    pages: {
        signIn: '/login',
        newUser: '/register',
        signOut: '/login',
        error: '/login'
    }
});

export const config = {
    matcher: ['/dashboard/:path*', '/c/:path*']
};
