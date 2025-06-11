import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Loader2 } from "lucide-react"

export function VerifyOtpForm({
  className,
  register,
  onGenOtp,
  onSubmit,
  errors,
  isVerifying,
  isGenerating,
  ...props
}) {


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={onSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Verify your Email</h1>
              </div>
              <div className="grid gap-3">
                <Button onClick={onGenOtp}>
                  { !isGenerating ? "Click here to receive OTP" : <Loader2 className="animate-spin" />}
                </Button>
              </div>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                    <Label htmlFor="otp">One Time Password (OTP)</Label>
                    {errors.otp && (
                        <p className="text-red-500 text-xs px-2">{`* ${errors.otp.message}`}</p>
                    )}
                </div>
                <Input id="otp" {...register("otp")} type="otp" placeholder="123456" required />   
              </div>
              <Button type="submit" className="w-full" disabled={isVerifying}>
                {isVerifying
                    ?
                    (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Processing...
                        </>
                    ) 
                    : 
                    ("Verify")
                }
              </Button>
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
