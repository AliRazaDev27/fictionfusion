"use server"
import { signIn } from "@/auth"
export async function authenticate(formData: FormData) {
    try {
        const [email, password] = [formData.get("email"), formData.get("password")]
        if (!email || !password) {
            return {
                success: false
            }
        }
        await signIn(email as string, password as string)
        return {
            success: true
        }
    }
    catch (error: any) {
        console.log(error.message)
        return {
            success: false
        }
    }
}
