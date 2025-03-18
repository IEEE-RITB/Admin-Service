"use client";

import { loginUser } from "@/actions/auth-actions";
import { ISignInSchema, SignInSchema } from "@/validators/user-validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

export function SignIn() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(SignInSchema),
    });

    async function handleSignin(data: ISignInSchema) {
        const result = await loginUser(data);
        if (result.error) {
            toaster.error({ title: "Error", description: result.error });
            return;
        }
        router.push('/');
    }

    return (
        <form onSubmit={handleSubmit(async (data) => await handleSignin(data))}>
            <label>
                username
                <input {...register('username')} />
                {errors.username?.message && <p>{errors.username?.message}</p>}
            </label>
            <label>
                Password
                <input {...register('password')} />
                {errors.password?.message && <p>{errors.password?.message}</p>}
            </label>
            <button>Sign In</button>
        </form>
    )
};
