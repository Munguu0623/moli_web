import { useEffect, useState } from "react";
import cn from "clsx";
import { DiscussionEmbed } from "disqus-react";

type TProps = {
    id: string;
    title: string;
    className?: string;
};

const DisqusComment = ({ id, title, className }: TProps) => {
    const [href, setHref] = useState("");
    useEffect(() => {
        setHref(window.location.href);
    }, []);

    const disqusShortname = "moli-1";
    const disqusConfig = {
        url: href,
        identifier: id,
        title,
    };
    return (
        <div className={cn("comments tw-pt-[75px]", className)}>
            <div className="tw-mb-7.5">
                <h3 className="tw-mb-5">Сэтгэгдлээ энд үлдээнэ үү</h3>
                <p>Таны мэйл хаяг илгээгдэхгүй. Одтой талбарууд</p>
            </div>
            <DiscussionEmbed
                shortname={disqusShortname}
                config={disqusConfig}
            />
        </div>
    );
};

export default DisqusComment;
