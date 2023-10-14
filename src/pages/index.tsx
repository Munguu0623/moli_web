import type { NextPage } from "next";
import { GetStaticProps } from "next";
import Layout from "@layout/layout-01";
import Wrapper from "@ui/wrapper/wrapper-03";
import HeroArea from "@containers/hero/layout-04";
import { normalizedData } from "@utils/methods";
import { IBlog, ICourse, IEvent, UserData } from "@utils/types";
import { getPageData } from "../lib/page";
import { getAllBlogs } from "../lib/blog";
import { getallCourses, getFilteredCourse } from "../lib/course";
import FunfactArea from "@containers/funfact/layout-02";
import SEO from "@components/seo/deafult-seo";
import BlogArea from "@containers/blog/layout-03";
import CourseArea from "@containers/course/layout-07";
import EventArea from "@containers/event/layout-03";
import { getallEvents } from "lib/event";
import BrandArea from "@containers/brand/layout-02";
import AppDownloadArea from "@containers/app-download";
import RegisterGuideArea from "@containers/register-guide";
import TestimonialArea from "@containers/testimonial/layout-07";
import { getPost } from "lib/lib/post";

interface PageContent {
    section: string;
}

type TProps = {
    data: {
        page: {
            content: PageContent[];
        };
        courses: ICourse[];
        blogs: IBlog[];
        events: IEvent[];
    };
};

type PageProps = NextPage<TProps> & {
    Layout: typeof Layout;
};

const Home: PageProps = ({ data }) => {
    const content = normalizedData<PageContent>(data.page?.content, "section");

    return (
        <>
            {/* <SEO title="Remote Training" /> */}
            {/* Hero хэсэг */}
            <HeroArea
                data={{
                    ...content?.["hero-area"],
                }}
            />
            {/*  Тоон үзүүлэлт */}
            <Wrapper>
                <FunfactArea
                    data={content?.["funfact-area"]}
                    bg="tw-bg-white-catskill"
                />
            </Wrapper>
            {/* Couch Home */}
            <CourseArea
                data={{ ...content?.["course-area"], courses: data.courses }}
                titleSize="large"
            />
            {/* Блог  Home*/}
            <BlogArea
                data={{ ...content?.["blog-area"], blogs: data.blogs }}
                titleSize="large"
            />
            {/* Events Home */}
            <EventArea
                data={{ ...content?.["event-area"], events: data.events }}
                titleSize="large"
            />

            {/* сэтгэгдэл */}
            <TestimonialArea data={content?.["testimonial-area"]} />
            {/* Хамтран ажилдаг байгуулага */}
            <BrandArea data={content?.["brand-area"]} />
            {/* App татах */}
            <AppDownloadArea
                // className=" tw-fill-pampas"
                data={content?.["app-download-area"]}
                titleSize="large"
                space="top"
            />
        </>
    );
};

Home.Layout = Layout;

export const getStaticProps: GetStaticProps = async() => {
    const page = getPageData("home", "index-01");
    const courses = getallCourses(
        [
            "title",
            "thumbnail",
            "price",
            "currency",
            "total_lectures",
            "total_students",
        ],
        0,
        6
    );
    const events = getallEvents(
        ["title", "thumbnail", "start_date", "location"],
        0,
        4
    );
    const popularCourse = getFilteredCourse(
        [
            "title",
            "published_at",
            "thumbnail",
            "price",
            "currency",
            "excerpt",
            "isPopular",
        ],
        "isPopular",
        true
    );
    const { blogs } = await getAllBlogs(
        ["title", "image", "createdDate", "views"],
        0,
        3
    );
    return {
        props: {
            data: {
                page,
                courses,
                popularCourse,
                blogs,
                events,
            },
            layout: {
                headerTransparent: true,
                headerFluid: false,
                footerMode: "light",
            },
        },
    };
};

export default Home;
