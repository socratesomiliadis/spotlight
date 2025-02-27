"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-fit h-fit">
      <div
        className={cn(
          "relative w-10 h-10 flex items-center transition-all duration-400 ease-out-expo rounded-lg overflow-hidden",
          isOpen && "bg-white w-72"
        )}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute size-4 flex items-center justify-center ml-2 z-10 text-[#989898]"
        >
          <svg
            width="80%"
            className={cn(
              "absolute x-icon translate-x-[-200%] transition-all duration-300 ease-out-expo",
              isOpen && "translate-x-0"
            )}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.21967 0.21967C0.512563 -0.0732233 0.987437 -0.0732233 1.28033 0.21967L8 6.93934L14.7197 0.21967C15.0126 -0.0732233 15.4874 -0.0732233 15.7803 0.21967C16.0732 0.512563 16.0732 0.987437 15.7803 1.28033L9.06066 8L15.7803 14.7197C16.0732 15.0126 16.0732 15.4874 15.7803 15.7803C15.4874 16.0732 15.0126 16.0732 14.7197 15.7803L8 9.06066L1.28033 15.7803C0.987437 16.0732 0.512563 16.0732 0.21967 15.7803C-0.0732233 15.4874 -0.0732233 15.0126 0.21967 14.7197L6.93934 8L0.21967 1.28033C-0.0732233 0.987437 -0.0732233 0.512563 0.21967 0.21967Z"
              fill="currentColor"
            />
          </svg>

          <svg
            width="100%"
            viewBox="0 0 13 13"
            className={cn(
              "absolute search-icon translate-x-0 transition-all duration-300 ease-out-expo",
              isOpen && "translate-x-[-200%]"
            )}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.5 11.5L8.90781 8.90781M10.1875 5.59375C10.1875 8.13081 8.13081 10.1875 5.59375 10.1875C3.05669 10.1875 1 8.13081 1 5.59375C1 3.05669 3.05669 1 5.59375 1C8.13081 1 10.1875 3.05669 10.1875 5.59375Z"
              stroke="currentColor"
              strokeWidth="1.3125"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <input
          type="text"
          placeholder="Search"
          className="w-full pr-2 overflow-hidden h-full bg-transparent outline-none ml-9 -mb-1 leading-none placeholder:leading-none"
        />
        <button
          className={cn(
            "mr-1 text-white text-xs py-2 px-4 bg-black rounded-md flex opacity-0 transition-all duration-400 ease-out-expo translate-x-[300%]",
            isOpen && "opacity-100 translate-x-0"
          )}
        >
          <span className="-mb-0.5">Enter</span>
        </button>
      </div>
    </div>
  );
}
