Authentication Guide for UCollab
Introduction
UCollab uses NextAuth.js for a secure and user-friendly authentication experience, integrating with Microsoft Azure Active Directory (Azure AD) to allow University of Cincinnati (UC) students to sign in using their UC credentials. This ensures that only authorized UC students can access UCollab, facilitating safe collaboration on projects, discussions, and mentorship.
By setting up authentication with Azure AD, UCollab enhances security, ensures compliance with UC policies, and creates a seamless login experience for users. This guide will cover the technical setup and configuration details for enabling and managing authentication within UCollab.
________________________________________
Authentication Flow
Here’s a high-level overview of the authentication flow in UCollab:
1.	Initiate Sign-In: The user clicks the "Sign in with UC credentials" button on the site.
2.	Redirect to Azure AD: The user is redirected to Microsoft Azure AD’s login page.
3.	Authenticate: The user enters their UC credentials.
4.	Redirect Back: Upon successful authentication, the user is redirected back to UCollab.
5.	Session Creation: NextAuth.js manages the user session, storing relevant details.
6.	Access Granted: The authenticated user can now access protected routes and features in UCollab.
This flow ensures a streamlined, secure, and familiar experience for UC students while keeping UCollab’s data safe and accessible only to authorized users.
________________________________________
Technical Setup and Configuration
This section will cover the key components and configuration steps for setting up authentication in UCollab.
1. Providers: Configuring Azure AD as the Authentication Provider
Azure AD is used as the authentication provider in UCollab. Below is a sample configuration for integrating Azure AD with NextAuth.js.
Step 1: Register an Application in Azure AD
1.	In the Azure Portal, register a new application to obtain your client ID, client secret, and tenant ID.
2.	Configure the app to redirect to your application URL, e.g., http://localhost:3000/api/auth/callback/azure-ad.
Step 2: Add Environment Variables
In your .env file, add the following credentials for Azure AD:
AZURE_AD_CLIENT_ID="your-client-id"
AZURE_AD_CLIENT_SECRET="your-client-secret"
AZURE_AD_TENANT_ID="your-tenant-id"
NEXTAUTH_URL="http://localhost:3000"  # Adjust as needed for production
NEXTAUTH_SECRET="your-random-secret"
Step 3: Update authOptions Providers
In src/server/auth.ts, set up Azure AD as the provider:
import AzureADProvider from "next-auth/providers/azure-ad";

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: env.AZURE_AD_CLIENT_ID,
      clientSecret: env.AZURE_AD_CLIENT_SECRET,
      tenantId: env.AZURE_AD_TENANT_ID,
    }),
  ],
  adapter: PrismaAdapter(db) as Adapter,
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
};
________________________________________
2. Session Management: Using JSON Web Tokens (JWT)
Sessions in UCollab are managed using JSON Web Tokens (JWT). The session callback in NextAuth.js is customized to include the user's ID, which simplifies access to user-specific data throughout the app.
•	Session Callback: The session callback enriches the session object with additional user details, such as the user ID.
3. Protecting Routes with Middleware
UCollab uses Next.js middleware to secure routes. Here’s an outline of how this works:
1.	Middleware: Protects pages by checking for a valid session. If a user isn’t authenticated, they’re redirected to the sign-in page.
2.	Server-Side Protection: The getServerAuthSession helper function checks the session for server-rendered pages.
Code Example: Middleware
In src/middleware.ts, you might have something like:
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});
Server-Side Example: getServerAuthSession in getServerSideProps
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
________________________________________
Accessing Session Data
In UCollab, session data can be accessed in both client-side and server-side contexts.
1. Client-Side Session Access with useSession()
Use the useSession hook from NextAuth.js to access the current session in client-side components.
import { useSession } from "next-auth/react";

const Component = () => {
  const { data: session } = useSession();

  if (session) {
    return <p>Signed in as {session.user.email}</p>;
  }
  return <p>Not signed in</p>;
};
2. Server-Side Session Access with getServerAuthSession()
Access session data on the server side with getServerAuthSession.
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
________________________________________
Environment Variables and Security
Environment variables store sensitive information like client IDs and secrets, ensuring they are not exposed in the codebase.
Add the following to your .env file:
AZURE_AD_CLIENT_ID="your-client-id"
AZURE_AD_CLIENT_SECRET="your-client-secret"
AZURE_AD_TENANT_ID="your-tenant-id"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret"
Note: Never commit .env files to version control to protect sensitive data.
________________________________________
Additional Tips
•	Handling Redirects: NextAuth.js supports dynamic callback URLs, allowing users to return to their original destination post-login.
•	Error Handling: Common authentication issues may arise from incorrect environment variables or provider configuration. Always ensure that client IDs and secrets are valid.

