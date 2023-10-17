import SearchWidget from "@widgets/search-widget";
import RecentPostsWidget from "@widgets/recent-posts-widget";
import BannerWidget from "@widgets/banner-widget";
import { BlogMetaType, IBlog } from "@utils/types";
import CategoryWidget from "@components/widgets/category-widget";

type TProps = {
    recentPosts: Pick<IBlog, "title" | "path">[];
    category: BlogMetaType[] | undefined;
};

const BlogSidebar = ({ recentPosts, category }: TProps) => {
    return (
        <>
            <SearchWidget />
            <RecentPostsWidget recentPosts={recentPosts} />
            <BannerWidget />
            <CategoryWidget category={category} />
        </>
    );
};

export default BlogSidebar;
