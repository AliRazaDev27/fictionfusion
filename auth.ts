import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import email from "next-auth/providers/email"
import { getUser } from "./actions/userActions"
import bcrypt from "bcrypt"
import { authConfig } from './auth.config';


export const { signIn, signOut, auth } = NextAuth({...authConfig,
  providers: [
    Credentials({
        credentials:{
            email:{},
            password:{},
        },
        authorize: async (credentials)=>{
            
            const {email, password} = credentials
            const user = await getUser(email as string)
            console.log(user)
            const passwordMatch = await bcrypt.compare(password as string, user?.password as string)
            if(passwordMatch){
                console.log("Logged in")
                return user
            }
            else{
                console.log("Invalid credentials")
            }
            return null
        },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
        console.log(token)
        console.log(user)
      if (user) {
        token.id = user?.id
        token.name = user?.name
        token.role = user?.role

      }
      return token
    },
    async session({ session, token }) {
        
      if(token){
        session.user.id = token.id
        session.user.name = token.name
        session.user.role = token.role
      }
      return session
    },
  },
})