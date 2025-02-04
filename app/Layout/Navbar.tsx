import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../Configs/ThemeContext";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedPageList,
  setCurrentSide,
  transitionPage,
} from "@/lib/features/routes/routeSlice";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Network from "@/utils/Network";
import Link from "next/link";
type Props = {};

const Navbar = (props: Props) => {
  const { t } = useTranslation("common");
  const { theme } = useTheme();
  const selectPageList = useSelector(selectedPageList);

  const currentPage = selectPageList.find((i) => i.isOpen);
  const currentPageIndex = selectPageList.findIndex((i) => i.isOpen);
  const [isSearch, setIsSearch] = useState(false);
  const [searchList, setSeachList] = useState([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const elem = document.documentElement;
    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch((err) => {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
          );
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const router = useRouter();
  const dispatch = useDispatch();
  const mode = window.localStorage.getItem("theme");
  const lang = window.localStorage.getItem("lng");
  const changeMode = (m: string) => {
    window.localStorage.setItem("theme", m);
    router.reload();
  };
  const changeLanguage = (lng: string) => {
    window.localStorage.setItem("lng", lng);
    router.reload();
  };
  const handlePrev = () => {
    dispatch(
      transitionPage({
        index: currentPageIndex,
        arr: selectPageList,
        type: "prev",
      })
    );
  };
  const handleNext = () => {
    dispatch(
      transitionPage({
        index: currentPageIndex,
        arr: selectPageList,
        type: "next",
      })
    );
  };

  const searchHandle = async (value: string) => {
    if (value.length < 3) {
      setSeachList([]);
      return;
    }
    try {
      const res = await Network.run(
        null,
        "GET",
        `/api/blogs/search?s=${value}`,
        null
      );
      setSeachList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.ctrlKey && event.key === "p") {
        event.preventDefault();
        dispatch(setCurrentSide("pages"));
        localStorage.setItem("openPortfolio", "true");
        localStorage.setItem("currentSide", "pages");
      }
      // if (event.ctrlKey && event.key === "s") {
      //   event.preventDefault();
      //   dispatch(setCurrentSide("search"));
      //   localStorage.setItem("currentSide","search")
      // }
      if (event.ctrlKey && event.key === "l") {
        event.preventDefault();
        changeLanguage(lang === "tr" ? "en" : "tr");
      }
      if (event.ctrlKey && event.key === "m") {
        event.preventDefault();
        changeMode(mode === "light" ? "dark" : "light");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isSearch) {
      if (inputRef.current) {
        (inputRef.current as HTMLInputElement).focus();
      }
    }
  }, [isSearch]);

  const navBg = theme === "dark" ? "bg-dark3 text-light5/90" : "bg-light3";
  return (
    <div className={`w-full flex justify-between items-center  h-10 ${navBg}`}>
      <div className='w-[55px] flex justify-center'>
        <Icon icon='skill-icons:vscode-light' fontSize={24} />
      </div>
      <div className='flex items-center'>
        <div className='flex'>
          <Icon
            onClick={handlePrev}
            icon='formkit:arrowleft'
            className={`cursor-pointer ${
              theme === "dark"
                ? "text-light1 hover:text-light3"
                : "text-dark2 hover:text-dark6"
            }`}
          />
          <Icon
            onClick={handleNext}
            icon='formkit:arrowright'
            className={`cursor-pointer ${
              theme === "dark"
                ? "text-light1 hover:text-light3"
                : "text-dark2 hover:text-dark6"
            }`}
          />
        </div>
        <div
          onClick={() => {
            setIsSearch(true);
          }}
          className={`rounded-md max-w-[500px] w-auto md:w-[500px]  flex justify-center items-center ml-4 border ${
            theme === "dark"
              ? "border-slate-400 text-light2 hover:bg-dark5"
              : "border-slate-400 text-dark3 hover:bg-light2"
          }`}
        >
          {!isSearch && searchList.length == 0 ? (
            <p className='py-1 px-4'>
              {currentPage ? t(currentPage.title) : t("welcome")}
            </p>
          ) : (
            <div className='relative w-full'>
              <input
                ref={inputRef}
                type='text'
                placeholder='Search...'
                onBlur={() => {
                  setIsSearch(false);
                }}
                onChange={(e) => searchHandle(e.target.value)}
                className='outline-none w-full py-1 rounded-md px-4 bg-light1 text-light5'
              />
              {searchList.length > 0 && (
                <div
                  className={`absolute top-10 border w-full flex divide-y flex-col z-50 shadow-lg ${
                    theme == "dark" ? "bg-dark4 border-dark3 " : " bg-light1 border-light4"
                  }`}
                >
                  {searchList.map(
                    (item: { title: string; url: string; code: string }) => {
                      return (
                        <Link
                          onClick={() => setSeachList([])}
                          href={
                            "/blogs/" +
                            item.url.replace("—", "") +
                            "-" +
                            item.code
                          }
                          className={`p-2 cursor-pointer w-full text-[13px] ${
                            theme == "dark"
                              ? "hover:bg-dark5"
                              : "hover:bg-light4"
                          }`}
                        >
                          {item.title}
                        </Link>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className='flex items-center'>
        {/* <div
          className={`w-10 h-10 flex justify-center items-center cursor-pointer ${
            theme === "dark" ? "hover:bg-dark5" : "hover:bg-light2"
          }`}
        >
          <Icon icon='ic:round-minus' />
        </div> */}
        <div
          onClick={toggleFullscreen}
          className={`w-10 h-10 md:flex hidden justify-center items-center cursor-pointer ${
            theme === "dark" ? "hover:bg-dark5" : "hover:bg-light2"
          }`}
        >
          <Icon icon='ph:square-light' />
        </div>
        {/* <div
          className={`w-10 h-10 flex justify-center items-center cursor-pointer ${
            theme === "dark" ? "hover:bg-dark5" : "hover:bg-light2"
          }`}
        >
          <Icon icon='heroicons:x-mark-solid' />
        </div> */}
      </div>
    </div>
  );
};

export default Navbar;
