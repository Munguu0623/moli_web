import { useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Typewriter } from "react-simple-typewriter";
import Button from "@ui/button";
import BottomShape from "@components/ui/bottom-shape/shape-02";
import { useUI } from "@contexts/ui-context";
import {
    ButtonType,
    HeadingType,
    ImageType,
    TextType,
    VideoType,
} from "@utils/types";
import { scrollUpVariants } from "@utils/variants";

const ModalVideo = dynamic(() => import("../../../components/ui/video-modal"), {
    ssr: false,
});

type TProps = {
    data: {
        images?: ImageType[];
        headings?: HeadingType[];
        texts?: TextType[];
        buttons?: ButtonType[];
        video?: VideoType;
    };
};

const HeroArea = ({
    data: { images, headings, texts, buttons, video },
}: TProps) => {
    const [isOpen, setOpen] = useState(false);
    const { trans1 } = useUI();
    const words =
        headings?.slice(1, headings.length).map((heading) => heading.content) ||
        [];
    return (
        <>
            <div className="hero-area tw-relative tw-pt-[100px] tw-pb-[130px] md:tw-py-[170px] xl:tw-pt-[270px] xl:tw-pb-[248px]  ">
                {images?.[0]?.src && (
                    <div className="tw-absolute tw-inset-0 -tw-z-10">
                        <img
                            src={images[0].src}
                            alt={images[0]?.alt || "bg"}
                            loading="eager"
                            className="tw-w-full tw-h-full tw-object-cover"
                        />
                    </div>
                )}
                <motion.div
                    className="tw-container tw-text-center"
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={scrollUpVariants}
                >
                    {headings?.[0]?.content && (
                        <h1 className="tw-text-[46px] lg:tw-text-[56px] tw-leading-tight tw-font-medium tw-text-white">
                            <div> {headings[0].content} </div>
                            <span className="tw-text-primary tw-inline-block">
                                <Typewriter words={words} loop cursor />
                            </span>
                        </h1>
                    )}

                    <div className="tw-w-full tw-flex tw-justify-center ">
                        <div className="tw-w-8/12  tw-flex tw-justify-center tw-items-center">
                            {texts?.map((text) => (
                                <p
                                    key={text.id}
                                    className="tw-text-lg tw-font-medium tw-leading-relaxed tw-text-white tw-mb-5 sm:tw-mb-8"
                                >
                                    {text.content}
                                </p>
                            ))}
                        </div>
                    </div>
                    <motion.div
                        className="intro1-scene tw-absolute -tw-z-1 -tw-right-11 -tw-bottom-11 tw-w-[136px]"
                        animate={{
                            x: trans1().x,
                            y: trans1().y,
                        }}
                    >
                        <img
                            src="/images/shape-animation/shape-1.png"
                            alt=""
                            width={136}
                            height={136}
                        />
                    </motion.div>
                    <div className="tw-flex tw-items-center tw-justify-center tw-flex-wrap">
                        {buttons?.[1] && (
                            <Button
                                {...buttons[1]}
                                className="tw-m-2.5"
                                onClick={() => setOpen(true)}
                            >
                                <i
                                    className={clsx(
                                        buttons[1]?.icon,
                                        "tw-mr-4"
                                    )}
                                />
                                {buttons[1].content}
                            </Button>
                        )}
                    </div>
                </motion.div>
                <BottomShape color="tw-fill-light-100" />
            </div>
            {video && (
                <ModalVideo
                    show={isOpen}
                    videoId={video.videoId}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
};

export default HeroArea;
