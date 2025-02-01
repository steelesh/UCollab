import { type Role } from "@prisma/client"; // adjust according to your Role type

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email?: string | null;
            name?: string | null;
            image?: string | null;
            role: Role; // use your Role type or string if simpler
            username: string;
            profile: {
                skills?: string;
                gradYear?: number;
                bio?: string;
            };
        };
    }

    interface User {
        id: string;
        email?: string | null;
        name?: string | null;
        image?: string | null;
        role: Role;
        username: string;
        profile: {
            skills?: string;
            gradYear?: number;
            bio?: string;
        };
    }
}