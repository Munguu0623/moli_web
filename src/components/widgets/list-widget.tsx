import clsx from "clsx";
import Anchor from "@ui/anchor";
import WidgetTitle from "./widget-title";

type TProps = {
    className?: string;
    mode?: "light" | "dark";
};

const ListWidget = ({ className, mode }: TProps) => {
    return (
        <div className={clsx(className)}>
            <WidgetTitle mode={mode}>Мэдээлэл</WidgetTitle>
            <ul
                className={clsx(
                    "tw-text-md tw-font-medium",
                    mode === "dark" && "tw-text-gray-400"
                )}
            >
                <li className="tw-pr-5 tw-mb-[11px]">
                    <Anchor path="/membership-levels">Гишүүнчлэл</Anchor>
                </li>
                <li className="tw-pr-5 tw-mb-[11px]">
                    <Anchor path="/purchase-guide">
                        Худалдан авах мэдээлэл
                    </Anchor>
                </li>
                <li className="tw-pr-5 tw-mb-[11px]">
                    <Anchor path="/privacy-policy">Нууцлалын бодлого</Anchor>
                </li>
                <li className="tw-pr-5 tw-mb-[11px]">
                    <Anchor path="/terms-of-service">
                        Үйлчилгээний нөхцөлүүд
                    </Anchor>
                </li>
            </ul>
        </div>
    );
};

export default ListWidget;
