import { Link } from "react-router-dom"

// import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { Button } from "@/components/ui/button"
import { ForgotPasswordForm } from "@/components/forget-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Forgot Password</h1>
          <p className="text-muted-foreground">Enter your email to reset your password</p>
        </div>
        <ForgotPasswordForm/>
        <div className="mt-4 text-center">
          <Link to="/">
            <Button variant="link" className="text-blue-600 hover:text-blue-700">
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}