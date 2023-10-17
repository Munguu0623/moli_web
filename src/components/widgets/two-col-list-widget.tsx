import clsx from "clsx";
import Anchor from "@ui/anchor";
import WidgetTitle from "./widget-title";

type TProps = {
    className?: string;
    mode?: "light" | "dark";
};

const TwoColumnListWidget = ({ className, mode }: TProps) => {
    return (
        <div className={clsx(className)}>
            <WidgetTitle mode={mode}>Булангууд</WidgetTitle>
            <ul
                className={clsx(
                    "tw-flex tw-flex-wrap tw-text-md tw-font-medium",
                    mode === "dark" && "tw-text-gray-400"
                )}
            >
                {/* <li className="tw-w-1/2 tw-pr-5 tw-mb-[11px]">
                    <Anchor path="/start-here">Start here</Anchor>
                </li> */}
                {/* <li className="tw-w-1/2 tw-pr-5 tw-mb-[11px]">
                    <Anchor path="/success-story">Success story</Anchor>
                </li> */}
                <li className="tw-w-1/2 tw-pr-5 tw-mb-[11px]">
                    <Anchor path="/blogs/blog-grid-sidebar">Мэргэжил</Anchor>
                </li>
                {/* <li className="tw-w-1/2 tw-pr-5 tw-mb-[11px]">
                    <Anchor path="/courses/grid-01">Х</Anchor>
                </li> */}
                <li className="tw-w-1/2 tw-pr-5 tw-mb-[11px]">
                    <Anchor path="/about-us-01">Бидний тухай</Anchor>
                </li>
                <li className="tw-w-1/2 tw-pr-5 tw-mb-[11px]">
                    <Anchor path="/contact-us">Бидэнтэй холбогдох</Anchor>
                </li>
            </ul>
        </div>
    );
};

export default TwoColumnListWidget;
