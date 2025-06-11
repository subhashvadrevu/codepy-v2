import { VerifyOtpForm } from '@/components/VerifyOtpForm'
import { useAuthStore } from '@/store/useAuthStore'
import { verifyOtpSchema } from '@/utilities/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

const VerifyOtpPage = () => {

    const { register, handleSubmit, formState: {errors} } = useForm({ resolver: zodResolver(verifyOtpSchema) });

    const { generateOtp, verifyEmail, isVerifying, isGenerating } = useAuthStore();

    const navigate = useNavigate();


    const onVerify = async(data) => {
        try {
            console.log("didi data:", data);
            await verifyEmail(data);
            console.log("verification data : ", data);
            navigate("/");

        } catch (error) {
            console.log("error verifying otp: ", error);
        }
    };

    const onGenOtp = async() => {
        try {
            await generateOtp();
        } catch (error) {
            console.log("error generating otp: ", error);
        }
    };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 w-full">
        <div className="w-full max-w-sm md:max-w-3xl">
            <VerifyOtpForm
                register={register}
                onSubmit={handleSubmit(onVerify)}
                onGenOtp={onGenOtp}
                errors={errors}
                isVerifying={isVerifying}
                isGenerating={isGenerating}
            />
        </div>
    </div>
  )
}

export default VerifyOtpPage