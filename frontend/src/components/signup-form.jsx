import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Eye, EyeClosed, Loader2 } from "lucide-react"

export function SignupForm({
  className,
  register,
  onSubmit,
  errors,
  isSigningUp,
  showPassword,
  setShowPassword,
  ...props
}) {

  const togglePassword = () => setShowPassword(prev => !prev)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={onSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome</h1>
                <p className="text-muted-foreground text-balance">
                  Create an account
                </p>
              </div>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                    <Label htmlFor="name">Name</Label>
                    {errors.name && (
                        <p className="text-red-500 text-xs px-2">{`* ${errors.name.message}`}</p>
                    )}
                </div>
                <Input id="name" {...register("name")} type="name" placeholder="John Doe" required />   
              </div>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                    <Label htmlFor="email">Email</Label>
                    {errors.email && (
                        <p className="text-red-500 text-xs px-2">{`* ${errors.email.message}`}</p>
                    )}
                </div>
                <Input id="email" {...register("email")} type="email" placeholder="johndoe@example.com" required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {errors.password && (
                    <p className="text-red-500 text-xs px-2">{`* ${errors.password.message}`}</p>
                  )}
                </div>
                <div className="relative flex items-center justify-between">
                  <Input 
                    id="password" 
                    {...register("password")} 
                    type = {showPassword ? "text" : "password"}
                    placeholder="* * * * * *" required />
                  {
                    showPassword ? 
                      <EyeClosed onClick={togglePassword} className="absolute right-2 size-4 cursor-pointer" />
                    : 
                      <Eye onClick={togglePassword} className="absolute right-2 size-4 cursor-pointer" />
                  }
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSigningUp}>
                {isSigningUp 
                    ?
                    (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Processing...
                        </>
                    ) 
                    : 
                    ("Sign Up")
                }
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <CardSpotlight className="w-full h-full flex items-center justify-center group">
              <span className="text-4xl font-extrabold text-white group-hover:text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] transition duration-300">
                CodePy
              </span>
            </CardSpotlight>
          </div>
        </CardContent>
      </Card>
      <div
        className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
