import { useForm, SubmitHandler } from "react-hook-form";
import Input from "@ui/form-elements/input";
import Button from "@ui/button";
import { hasKey } from "@utils/methods";
import React, { useState } from "react";

interface IFormValues {
    email: string;
    reg_username: string;
    reg_password: string;
    confirmPassword: string;
}

const RegisterForm = () => {
    const [selectedValue, setSelectedValue] = useState("select");
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<IFormValues>();

    const onSubmit: SubmitHandler<IFormValues> = (data) => {
        // eslint-disable-next-line no-console
        console.log(data);
    };

    return (
        <div className="tw-px-[50px]">
            <h3 className="tw-text-h2 tw-mb-5">Шинэ хаяг нээх</h3>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="tw-mb-7.5">
                    <label
                        htmlFor="email"
                        className="tw-text-heading tw-text-md"
                    >
                        Имейл хаяг *
                    </label>
                    <Input
                        id="email"
                        placeholder="Имейл"
                        bg="light"
                        feedbackText={errors?.email?.message}
                        state={hasKey(errors, "email") ? "error" : "success"}
                        showState={!!hasKey(errors, "email")}
                        {...register("email", {
                            required: "Имейл байхгүй байна",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "invalid email address",
                            },
                        })}
                    />
                </div>

                <div className="tw-mb-7.5">
                    <label
                        htmlFor="reg_password"
                        className="tw-text-heading tw-text-md"
                    >
                        Нууц үг *
                    </label>
                    <Input
                        id="reg_password"
                        type="password"
                        placeholder="Нууц үг"
                        bg="light"
                        autoComplete="true"
                        feedbackText={errors?.reg_password?.message}
                        state={
                            hasKey(errors, "reg_password") ? "error" : "success"
                        }
                        showState={!!hasKey(errors, "reg_password")}
                        {...register("reg_password", {
                            required: "нууц үг байхгүй байна",
                        })}
                    />
                </div>
                <div className="tw-mb-7.5">
                    <label
                        htmlFor="confirmPassword"
                        className="tw-text-heading tw-text-md"
                    >
                        Нууц үг давтах *
                    </label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Нууц үг давтах"
                        bg="light"
                        autoComplete="true"
                        feedbackText={errors?.confirmPassword?.message}
                        state={
                            hasKey(errors, "confirmPassword")
                                ? "error"
                                : "success"
                        }
                        showState={!!hasKey(errors, "confirmPassword")}
                        {...register("confirmPassword", {
                            required: "давтан нууц үг байхгүй байна",
                            validate: (value) =>
                                value === getValues("reg_password") ||
                                "давтан нууц үг тохирсонгүй",
                        })}
                    />
                </div>
                <div className="tw-mb-7.5">
                    <select
                        id="underline_select"
                        className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                        value={selectedValue} // Set the value of the select element based on the state
                        onChange={(e) => setSelectedValue(e.target.value)} // Update the state when the user selects an option
                    >
                        <option value="select">хэрэглэчийн эрх сонгох</option>
                        <option value="couch">Зөвөлгөө өгөх</option>
                        <option value="blogWrite">Блог бичих</option>
                        <option value="simple">Энгийн хэрэглэгч</option>
                    </select>
                </div>

                <Button type="submit" fullwidth className="tw-mt-7.5">
                    Бүртгүүлэх
                </Button>
            </form>
        </div>
    );
};

export default RegisterForm;
