import React from "react";
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";

import { LoginSchemeType, loginScheme } from "./scheme"
import { cn, mockErrorResponse } from "#/utils"
import { useLogin } from "#/services/auth-service"
import { ButtonSpinnerLoading } from "#/components/ui/lazy"
import { TOKEN } from "#/constant"

export default function LoginPage() {

    const navigate = useNavigate()
    const login = useLogin()

    const [passwordVisible, setPasswordVisible] = React.useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<LoginSchemeType>({
        resolver: zodResolver(loginScheme)
    })

    const submit = handleSubmit(({ username, password }) => {

        login.mutate({ username, password }, {
            onSuccess: (result) => {
                const token = result.data.token;
                localStorage.setItem(TOKEN, token)

                navigate("/upload")


            },
            onError: (error) => {
                const errorType = mockErrorResponse[error.response?.data.type as keyof typeof mockErrorResponse]
                const errorMessage = error.response?.data.message ?? "Something went wrong!"
                toast.error(errorType, {
                    description: errorMessage
                })
            }
        })
    })

    function toggleVisiblePassword() {
        setPasswordVisible((prev) => !prev)
    }

    const validInput = " outline-black-500 active:outline-black-500 "
    const inValidInput = "outline-red-500 active:outline-red-500 bg-red-50 with-shake-invalid"

    return (
        <main>
            <header className="p-5">
                <div>
                    <img src="/pertamina-logo.png" className="size-8" alt="logo" width={30} height={30} />
                </div>
            </header>
            <section className="min-h-[calc(100dvh_-_80px)] w-[calc(100%_-_50px)] max-w-[320px] mx-auto flex-center flex-col space-y-5 md:space-y-7">
                <div className="text-center  !-tracking-wide">
                    <h2 className="text-xl md:text-3xl font-semibold">Welcome back, Folks!</h2>
                    <p className="text-xs md:text-base text-slate-500">Please enter your details below</p>
                </div>
                <section className="w-full">
                    <form onSubmit={submit} className="space-y-5">
                        <div className="text-xs md:text-sm flex flex-col gap-2">
                            <label htmlFor="username" className="font-medium">Username</label>
                            <input
                                id="username"
                                type="text"
                                className={cn("bg-gray-100 p-3 rounded-[.63rem] border border-[#E5E5E5]", errors.username ? inValidInput : validInput)}
                                {...register("username")}
                                aria-invalid={Boolean(errors.username)}
                            />
                            <p className="text-red-500 text-xs md:text-[0.8rem] font-medium">{errors.username?.message}</p>
                        </div>
                        <div className="text-xs md:text-sm flex flex-col gap-2">
                            <label htmlFor="password" className="font-medium">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={passwordVisible ? "text" : "password"}
                                    className={cn("w-full bg-gray-100 p-3 rounded-[.63rem] border border-[#E5E5E5]", errors.password ? inValidInput : validInput)}
                                    {...register("password")}
                                    aria-invalid={Boolean(errors.password)}
                                />
                                <div className="absolute right-1 top-1/2 -translate-y-1/2 bg-gray-100 px-2" role="button" onClick={toggleVisiblePassword}>
                                    {!passwordVisible ? <VscEye className="text-2xl" /> : <VscEyeClosed className="text-2xl" />}
                                </div>
                            </div>
                            <p className="text-red-500 text-xs md:text-[0.8rem] font-medium">{errors.password?.message}</p>
                        </div>
                        <button
                            type="submit"
                            className="relative overflow-hidden text-xs md:text-base font-medium text-white text-center bg-black hover:bg-black/70 disabled:bg-black/70 w-full p-3 rounded-[.63rem] flex-center"
                            disabled={login.isPending}
                        >
                            <span className="!-tracking-wide select-none">Login</span>
                            {login.isPending &&
                                <ButtonSpinnerLoading />
                            }
                        </button>
                    </form>
                </section>
                <footer>
                    <p className="text-xs md:text-sm text-slate-500 select-none">
                        Dont have an account, <Link to="/auth/register" className="text-black font-semibold hover:underline">register here!</Link>
                    </p>
                </footer>
            </section>
        </main>
    )
}