import NextAuth from "next-auth";

import { authOptions } from "~/server/auth";

export default NextAuth(authOptions);

// Importing the core NextAuth library
import NextAuth from "next-auth";

// Importing the authentication options from the server configuration file
import { authOptions } from "~/server/auth";

// Exporting the NextAuth function with the specified authentication options
export default NextAuth(authOptions);
