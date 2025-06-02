import { LoginForm } from "@/components/login-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { loginSchema } from "@/utilities/zodSchema.js";
import { useAuthStore } from "@/store/useAuthStore";


const LoginPage = () => {

    const [showPassword, setShowPassword] = useState(false);
  
    const { login, isLoggingIn  } = useAuthStore();
  
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) })
  
    const onSubmit = async(data) => {
      try {
        await login(data);
        console.log("login data: ", data);
      } catch (error) {
        console.log("login failed: ",error);
      }
    };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 w-full">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm
          register={register} 
          onSubmit={handleSubmit(onSubmit)} 
          errors={errors} 
          isLoggingIn={isLoggingIn} 
          showPassword={showPassword} 
          setShowPassword={setShowPassword}
        />
      </div>
    </div>
  )
}

export default LoginPage;
