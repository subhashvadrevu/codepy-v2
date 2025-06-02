import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

import { SignupForm } from '@/components/signup-form.jsx';
import { signupSchema } from '@/utilities/zodSchema.js';
import { useAuthStore } from '@/store/useAuthStore';


const SignupPage = () => {

  const [showPassword, setShowPassword] = useState(false);

  const { signUp, isSigningUp  } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(signupSchema) })

  const onSubmit = async(data) => {
    try {
      await signUp(data);
      console.log("sign up data: ", data);
    } catch (error) {
      console.log("sign up failed: ",error);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 w-full">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm 
          register={register} 
          onSubmit={handleSubmit(onSubmit)} 
          errors={errors} 
          isSigningUp={isSigningUp} 
          showPassword={showPassword} 
          setShowPassword={setShowPassword}
        />
      </div>
    </div>
  )
}

export default SignupPage;