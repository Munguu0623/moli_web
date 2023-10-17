import Anchor from "@ui/anchor";
import { BlogMetaType } from "@utils/types";

type TProps = {
    category: BlogMetaType[] | undefined;
};

const CategoryWidget = ({ category }: TProps) => {
    return (
        <div className="tw-mt-[45px]">
            <h3 className="tw-mb-7.5">Ангилал</h3>
            <div className="-tw-m-[5px]">
                {category?.map((cat) => (
                    <Anchor
                        key={cat.id}
                        path={`/blogs/category/${cat.name}`}
                        className="tw-inline-block tw-text-[13px] tw-font-medium tw-leading-normal tw-pt-[7px] tw-pb-1.5 tw-px-3.8 tw-rounded-[3px] tw-bg-gray-200 tw-text-gray-400  tw-m-[5px] hover:tw-bg-primary hover:tw-text-white"
                    >
                        {cat.name}
                    </Anchor>
                ))}
            </div>
        </div>
    );
};

export default CategoryWidget;
