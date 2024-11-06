import { useTheme } from "@/app/Configs/ThemeContext";
import { BlogPost, TagProps } from "@/app/Configs/types";
import Network from "@/utils/Network";
import { Icon } from "@iconify/react/dist/iconify.js";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import Meta from "../../Patterns/Meta";
import { useRouter } from "next/router";

type Props = {};

const SingleBlogPost = ({}: Props) => {
  const router = useRouter();

  const [data, setDatas] = useState<any>({});

  const [like, setLike] = useState(0);
  const { theme } = useTheme();
  const getCount = async (endpoint: string) => {
    if (!router?.query.url || typeof router.query.url !== "string") {
      return;
    }
    const code = router?.query?.url?.split("BP-")[1];
    setLike((prev: number) => prev + 1);
    try {
      await Network.run(
        null,
        "GET",
        "/api/blogs/interactions/" + endpoint + "?code=" + code,
        null
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    if (!router?.query.url || typeof router.query.url !== "string") {
      return;
    }
    const code = router?.query?.url?.split("BP-")[1];
    try {
      const res = await Network.run(
        null,
        "GET",
        `/api/blogs/detail?code=${code}`,
        null
      );
      setLike(res.data.like);
      setDatas(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && data.content) {
      import("highlight.js").then((hljs) => {
        document.querySelectorAll("pre code").forEach((block) => {
          hljs.default.highlightAll();
        });
      });
    }
    getCount("view");
  }, [data.content]);
  return (
    <div className='w-full relative'>
      <Meta
        title={data.title}
        description={data.summary}
        keywords={data?.tags}
        ogTitle={data.title}
        ogDescription={data.summary}
      />
      <section className='w-full p-5 h-[calc(100vh-107px)] overflow-auto'>
        <h1 className='text-4xl my-0 font-semibold'>{data.title}</h1>
        <article className='my-6'>
          <div className='flex items-center py-1'>
            <div className='flex justify-start items-center mr-4'>
              <Icon icon={"fluent:calendar-ltr-12-regular"} className='mr-2' />
              <p className='italic text-sm' role='date'>
                {moment(data.releaseDate).format("MMMM DD [,] YYYY")}
              </p>
            </div>
            <div className='flex justify-start items-center mr-4'>
              <Icon icon={"fluent:pen-16-regular"} className='mr-2' />
              <p className='italic text-sm' role='author'>
                {data.author}
              </p>
            </div>
            <div className='flex justify-start items-center mr-2'>
              <p className='text-sm flex items-center' role='author'>
                {data.tags?.map((i: TagProps) => (
                  <Link
                    href={"/tags/" + i.url}
                    key={i._id}
                    className='mr-1 font-semibold cursor-pointer text-sm hover:underline hover:text-orange-500 flex items-center'
                  >
                    <Icon
                      icon={"line-md:hash-small"}
                      className='text-orange-500'
                    />
                    {i.name}
                  </Link>
                ))}
              </p>
            </div>
          </div>
          <div className='mt-2 text-sm font-medium content-area pr-4'>
            <div dangerouslySetInnerHTML={{ __html: data.content }} />
          </div>
        </article>
      </section>
      <div
        onClick={() => getCount("like")}
        className={`fixed bottom-10 right-10 cursor-pointer hover:shadow flex items-center border p-2 rounded-full animate-heartBeat ${
          theme == "dark" ? "bg-dark4" : "bg-white"
        }`}
      >
        <span className='text-lg font-semibold min-w-[40px] text-end select-none'>
          {like}
        </span>
        <Icon
          icon='ph:hands-clapping-fill'
          className='hover:text-orange-600 select-none hover:animate-wiggle'
          fontSize={36}
        />
      </div>
    </div>
  );
};

export default SingleBlogPost;
