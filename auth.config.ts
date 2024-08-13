export const authConfig = {
    pages: {
      signIn: '/login',
    },
    callbacks: {
      // BUG: don't fuck up here
      authorized({ auth, request: { nextUrl } }) {
        const isLoggedIn = !!auth?.user;
        const isOnDashboard = nextUrl.pathname.startsWith('/');
        if (isOnDashboard) {
          if (isLoggedIn) return true;
          return false; // Redirect unauthenticated users to login page
        }
        return true;
      },
    },
    providers: [],
  };