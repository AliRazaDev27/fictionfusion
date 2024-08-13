"use server"
import { signIn } from "@/auth"
export async function authenticate(formData:FormData) {
        try{
            await signIn("credentials",formData)
            return {
                success: true
            } 
        }
        catch(error:any){
            console.log(error.message)
            if(error.message === "NEXT_REDIRECT"){
                return {
                    success: true
                }
            }
            return {
                success: false
            }
        }
    }
        