"use server"
import { signIn } from "@/auth"
export async function authenticate(formData:FormData) {
        try{
            const [email,password] = [formData.get("email"),formData.get("password")]
            console.log(email,password)
            await signIn(email,password)
            return {
                success: true
            } 
        }
        catch(error:any){
            console.log(error.message)
            return {
                success: false
            }
        }
    }
        