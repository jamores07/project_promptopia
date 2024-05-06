import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { connectDB } from "@utils/database";
import User from "@models/user";


console.log({
    clientId: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
})


const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async session({ session }) {
            session.user = await User.findOne({ 
                email: session.user.email 
            });
            session.user.id = session.user._id.toString();
            
            return session;
            
        },

        async signIn({ profile }) {
            try {
                await connectDB();

                //check if user already exists
                const userExists = await User.findOne({ email: profile.email });

                //create and save a new user
                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(" ", "").toLowerCase(),
                        image: profile.picture
                    });
                }
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        },
    }
})

export { handler as GET, handler as POST };