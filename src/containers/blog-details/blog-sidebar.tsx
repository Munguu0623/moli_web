import SearchWidget from "@widgets/search-widget";
import RecentPostsWidget from "@widgets/recent-posts-widget";
import BannerWidget from "@widgets/banner-widget";
import { BlogMetaType, IBlog } from "@utils/types";

type TProps = {
    recentPosts: Pick<IBlog, "title" | "path">[];
};

const BlogSidebar = ({ recentPosts }: TProps) => {
    return (
        <>
            <SearchWidget />
            <RecentPostsWidget recentPosts={recentPosts} />
            <BannerWidget />
        </>
    );
};

export default BlogSidebar;
