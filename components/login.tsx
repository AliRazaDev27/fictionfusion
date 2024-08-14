"use client"
import { useTransition } from "react"
import Link from "next/link"
import { signIn } from "@/auth"
import { redirect } from "next/navigation"
import { useToast } from "./ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authenticate } from "@/actions/authActions"

export function LoginForm() {
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()
    const handleSubmit = async (formData:FormData) => {
        startTransition(async() => {
          const {success} = await authenticate(formData)
        console.log(success)
        if(success){
            toast({
                title:"Login Successful",
                description:"Redirecting to Homepage",
                className:"bg-green-500 text-white",
                duration:2000
            })
            redirect("/")
        }
        else{
            toast({
                title:"Login Failed",
                description:"Invalid Credentials",
                className:"bg-red-500 text-white",
                duration:2000
            })
            
        }
        })
    }
    
  return (
    <Card className="mx-auto max-w-sm">
        <form action={handleSubmit}>
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
      </form>
    </Card>
  )
}
