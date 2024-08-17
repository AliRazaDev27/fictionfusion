import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
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
            const user = await getUser(email)
            console.log(user)
            const passwordMatch = await bcrypt.compare(password, user?.password)
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