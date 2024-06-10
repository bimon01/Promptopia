"use client";

import React, { ChangeEvent, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { SearchIcon } from "lucide-react";
import { IPost } from "types/Type";
import { usePosts } from "@src/hooks/use-posts";
import Feed from "./Feed";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const { data: allPosts, refetch } = usePosts();
  const [showDialog, setShowDialog] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [searchedResults, setSearchedResults] = useState<IPost[]>([]);
  const router = useRouter();

  const filterMessages = useCallback(
    (searchText: string) => {
      const regex = new RegExp(searchText, "i");
      return allPosts.filter(
        (item) =>
          regex.test(item.user?.username || "") ||
          regex.test(item.tag || "") ||
          regex.test(item.message || ""),
      );
    },
    [allPosts],
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchText(searchTerm);
    const searchResult = filterMessages(searchTerm);
    setSearchedResults(searchResult);
  };

  const handleTagClick = (tag: string) => {
    setSearchText(tag);
    const searchResult = filterMessages(tag);
    setSearchedResults(searchResult);
    router.push(`/?tag=${tag}`);
  };

  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tag = urlParams.get("tag");
      if (tag) {
        setSearchText(tag);
        const searchResult = filterMessages(tag);
        setSearchedResults(searchResult);
      } else {
        setSearchText("");
        setSearchedResults([]);
      }
    };
    const urlParams = new URLSearchParams(window.location.search);
    const initialTag = urlParams.get("tag");
    if (initialTag) {
      setSearchText(initialTag);
      const searchResult = filterMessages(initialTag);
      setSearchedResults(searchResult);
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [allPosts, filterMessages]);

  const bibleVerse = [
    "So then, let us pursue what makes for peace",
    "and for mutual upbuilding, Romans 14:19",
  ];
  const description =
    "Welcome to our platform where you can build each other up by reading others' posts or creating your own to inspire others.";

  return (
    <>
      <div className="h-80vh fixed inset-0 flex flex-1 items-center justify-center overflow-hidden">
        <Image
          src="/assets/images/istock.webp"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="z-0 object-[left_-280px_top_0px] sm:object-center"
        />
        <section className="relative z-10 mt-[20%] flex flex-col items-center justify-center px-4 pb-10 font-inter text-white md:mt-[10%]">
          <div className="container text-center sm:-mt-20 ">
            <h1 className="mb-4 text-5xl font-bold md:text-7xl">
              Build and Grow
            </h1>
            <div className="">
              <div className="whitespace-pre-line text-sm font-light leading-snug md:text-base">
                {bibleVerse.map((verse, index) => (
                  <p key={index}>{verse}</p>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center py-10">
              <div className="relative ">
                <input
                  type="text"
                  placeholder="Search for a tag or a username"
                  value={searchText}
                  onChange={handleSearchChange}
                  className="mx-2 w-full rounded-3xl  bg-transparent px-10 py-2 text-sm text-white placeholder-white outline-none outline outline-1 outline-white focus:border-blue-500 focus:ring-1 focus:ring-[#59606E]"
                />
                <SearchIcon
                  className="absolute left-3 top-1/2 mx-1 -translate-y-1/2 transform text-gray-400"
                  strokeWidth={2.5}
                  size={20}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="relative z-20 mt-[70vh] h-full w-full rounded-3xl bg-purple-900  bg-opacity-0 bg-clip-padding py-1 backdrop-blur-3xl backdrop-filter">
        <Feed
          posts={searchText ? searchedResults : allPosts}
          handleTagClick={handleTagClick}
        />
      </div>
    </>
  );
};

export default HomePage;
