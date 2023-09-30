import AwardItem from "./AwardItem";
import { useEffect, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { useHeaderTheme } from "@/hooks/useHeaderTheme";
gsap.registerPlugin(ScrollTrigger);

export default function ExploreAwards() {
  const { headerTheme, setHeaderTheme } = useHeaderTheme();
  const [showMore, setShowMore] = useState<boolean>(false);

  useEffect(() => {
    ScrollTrigger.create({
      trigger: ".explore-section",
      start: "top 3%",
      onEnter: () => {
        setHeaderTheme("dark");
      },
      onLeaveBack: () => {
        setHeaderTheme("light");
      },
    });
  }, []);

  useEffect(() => {
    if (showMore) {
      gsap.to(".show-more-wrapper", { height: "auto", duration: 0.4 });
    }
  }, [showMore]);

  return (
    <section className="explore-section flex flex-col gap-24 items-center justify-center w-screen bg-white py-44">
      <div className="flex flex-col items-center w-full gap-6">
        <h2 className="text-black text-7xl">Awards of the Day</h2>
        <p className="text-center text-3xl text-softGray">
          An award is a recognition given to outstanding websites <br /> that
          provide exceptional content, design, and user experience.
        </p>
      </div>
      <div className="w-full px-8 grid grid-cols-3 gap-6">
        <AwardItem
          href="/"
          imgURL="/static/images/Vercel.png"
          category="Website Design"
          author="For 1UP Nova"
        />
        <AwardItem
          href="/"
          imgURL="/static/images/Rauno.png"
          category="Website Design"
          author="For 1UP Nova"
        />
        <AwardItem
          href="/"
          imgURL="/static/images/LunarImg.png"
          category="Website Design"
          author="For 1UP Nova"
        />
        <AwardItem
          href="/"
          imgURL="/static/images/Vercel.png"
          category="Website Design"
          author="For 1UP Nova"
        />
        <AwardItem
          href="/"
          imgURL="/static/images/Rauno.png"
          category="Website Design"
          author="For 1UP Nova"
        />
        <AwardItem
          href="/"
          imgURL="/static/images/LunarImg.png"
          category="Website Design"
          author="For 1UP Nova"
        />
        <AwardItem
          href="/"
          imgURL="/static/images/Vercel.png"
          category="Website Design"
          author="For 1UP Nova"
        />
        <AwardItem
          href="/"
          imgURL="/static/images/Rauno.png"
          category="Website Design"
          author="For 1UP Nova"
        />
        <AwardItem
          href="/"
          imgURL="/static/images/LunarImg.png"
          category="Website Design"
          author="For 1UP Nova"
        />
      </div>
      <div className="w-full px-8">
        <div className="bg-gradient-to-b from-[#f6f6f6] to-[#EEFCFF] w-full py-24 gap-16 flex flex-col items-center">
          <span className="text-softGray text-base">
            (Display your ad here with $50.90 for 15 days if you are a verified
            Spotlight user)
          </span>
          <h3 className="text-black text-6xl">Verification</h3>
          <div className="flex flex-row items-center gap-3 -mt-6">
            <Link
              href="/subscribe"
              className="px-8 py-3 bg-black rounded-full text-white"
            >
              Get Verified for $2.99/month
            </Link>
            <Link
              href="/subscribe"
              className="px-8 py-3 bg-[#FFC700] rounded-full text-black"
            >
              Get Pro for $12.99/month
            </Link>
          </div>
        </div>
      </div>
      <div className="relative w-full px-8 grid grid-cols-3 gap-6">
        {!showMore && (
          <button
            onClick={() => setShowMore(!showMore)}
            style={{ boxShadow: "1px 1px 3px 0px rgba(0, 0, 0, 0.25)" }}
            className="bg-white border-[#E2E2E2] border-[1px] absolute z-20 px-8 py-2 rounded-full left-1/2 -translate-x-1/2 bottom-2 flex items-center gap-2"
          >
            <span className="block">Show More</span>
            <span className="block w-3 mt-1">
              <svg
                width="100%"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.75 3.68942L8.21967 0.219745C8.51256 -0.0731478 8.98744 -0.0731478 9.28033 0.219745C9.57322 0.512639 9.57322 0.987512 9.28033 1.28041L5.63388 4.92685C5.14573 5.41501 4.35427 5.41501 3.86612 4.92685L0.21967 1.28041C-0.0732233 0.987512 -0.0732233 0.512639 0.21967 0.219745C0.512563 -0.0731478 0.987437 -0.0731478 1.28033 0.219745L4.75 3.68942Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </button>
        )}
        <AwardItem
          href="/"
          imgURL="/static/images/Vercel.png"
          category="Website Design"
          author="For 1UP Nova"
        />
        <AwardItem
          href="/"
          imgURL="/static/images/Rauno.png"
          category="Website Design"
          author="For 1UP Nova"
        />
        <AwardItem
          href="/"
          imgURL="/static/images/LunarImg.png"
          category="Website Design"
          author="For 1UP Nova"
        />

        <div
          style={{
            WebkitMaskImage: !showMore
              ? "linear-gradient(to bottom, black 0%, transparent 100%)"
              : "",
          }}
          className="col-span-3 show-more-wrapper grid grid-cols-3 gap-6 overflow-hidden h-24 pointer-events-none"
        >
          <AwardItem
            href="/"
            imgURL="/static/images/Vercel.png"
            category="Website Design"
            author="For 1UP Nova"
          />
          <AwardItem
            href="/"
            imgURL="/static/images/Rauno.png"
            category="Website Design"
            author="For 1UP Nova"
          />
          <AwardItem
            href="/"
            imgURL="/static/images/LunarImg.png"
            category="Website Design"
            author="For 1UP Nova"
          />
          <AwardItem
            href="/"
            imgURL="/static/images/Vercel.png"
            category="Website Design"
            author="For 1UP Nova"
          />
          <AwardItem
            href="/"
            imgURL="/static/images/Rauno.png"
            category="Website Design"
            author="For 1UP Nova"
          />
          <AwardItem
            href="/"
            imgURL="/static/images/LunarImg.png"
            category="Website Design"
            author="For 1UP Nova"
          />
        </div>
      </div>
    </section>
  );
}
