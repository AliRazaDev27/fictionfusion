"use client"
import { useToast } from "./ui/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useRef, useTransition } from "react"
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
import { createUser } from "@/actions/userActions"

export function SignupForm() {
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async () => {
    const name = nameRef.current?.value
    const email = emailRef.current?.value
    const password = passwordRef.current?.value
    console.log(name, email, password)
    startTransition(async () => {
      try {
        const user = await createUser(name as string, email as string, password as string, "ADMIN")
        toast({
          title: "User Created",
          description: "User created successfully",
          duration: 1500,
          className: "bg-green-500 text-white"
        });
        router.push("/")
      }
      catch (err:any) {
        console.log(err)
        toast({
          title: "User Creation Failed",
          description:  err?.message as string,
          className: "bg-red-500 text-white",
          duration: 1500
        })
      }

    })

  }



  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid  gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">First name</Label>
              <Input id="name" ref={nameRef} placeholder="Name" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              ref={emailRef}
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" ref={passwordRef} type="password" required />
          </div>
          <Button type="button" disabled={isPending} onClick={handleSubmit} className="w-full">
            Create an account
          </Button>

        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
