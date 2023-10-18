import { forwardRef, useState } from "react";
import clsx from "clsx";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "@ui/form-elements/input";
import Textarea from "@ui/form-elements/textarea";
import Feedback from "@ui/form-elements/feedback";
import Button from "@ui/button";
import { hasKey } from "@utils/methods";

type TProps = {
    className?: string;
};

interface IFormValues {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const ContactForm = forwardRef<HTMLFormElement, TProps>(
    ({ className }, ref) => {
        const [message, setMessage] = useState("");
        const {
            register,
            handleSubmit,
            formState: { errors },
        } = useForm<IFormValues>();

        const onSubmit: SubmitHandler<IFormValues> = (data) => {
            // eslint-disable-next-line no-console
           
            setMessage("Thank you for your message!");
        };
        return (
            <form
                className={clsx(className)}
                ref={ref}
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="tw-grid tw-grid-cols-1 tw-gap-5 tw-mb-5 md:tw-grid-cols-2 md:tw-gap-7.5 md:tw-mb-7.5">
                    <div>
                        <label htmlFor="name" className="tw-sr-only">
                            Нэр
                        </label>
                        <Input
                            id="name"
                            placeholder="Таны нэр *"
                            bg="light"
                            feedbackText={errors?.name?.message}
                            state={hasKey(errors, "name") ? "error" : "success"}
                            showState={!!hasKey(errors, "name")}
                            {...register("name", {
                                required: "Нэр заавал оруулна уу!",
                            })}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="tw-sr-only">
                            мэйл хаяг
                        </label>
                        <Input
                            type="email"
                            id="email"
                            placeholder="Мэйл хаяг *"
                            bg="light"
                            feedbackText={errors?.email?.message}
                            state={
                                hasKey(errors, "email") ? "error" : "success"
                            }
                            showState={!!hasKey(errors, "email")}
                            {...register("email", {
                                required: "Мэйл хаяг заавал оруулна уу!",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: "invalid email address",
                                },
                            })}
                        />
                    </div>
                </div>
                <div className="tw-mb-5 md:tw-mb-7.5">
                    <label htmlFor="subject" className="tw-sr-only">
                        Сэдэв
                    </label>
                    <Input
                        id="subject"
                        placeholder="Сэдэв *"
                        bg="light"
                        feedbackText={errors?.subject?.message}
                        state={hasKey(errors, "subject") ? "error" : "success"}
                        showState={!!hasKey(errors, "subject")}
                        {...register("subject", {
                            required: "Subject is required",
                        })}
                    />
                </div>
                <div className="tw-mb-5 md:tw-mb-7.5">
                    <label htmlFor="message" className="tw-sr-only">
                        сэтгэгдэл
                    </label>
                    <Textarea
                        id="message"
                        placeholder="Агуулга"
                        bg="light"
                        feedbackText={errors?.message?.message}
                        state={hasKey(errors, "message") ? "error" : "success"}
                        showState={!!hasKey(errors, "message")}
                        {...register("message", {
                            required: "Агуулгаа заавал бичнэ үү!",
                        })}
                    />
                </div>
                <Button type="submit" className="tw-w-[180px]">
                    Илгээх
                </Button>
                {message && <Feedback state="success">{message}</Feedback>}
            </form>
        );
    }
);

export default ContactForm;
