import { inter } from "@/pages/_app";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { Instagram, Twitter } from "lucide-react";
import Link from "next/link";

function SocialLink({
  color,
  icon,
  text,
  link,
}: {
  color: string;
  icon: React.ReactNode;
  text: string;
  link: string;
}) {
  return (
    <div
      style={inter.style}
      className="flex flex-row items-center w-full justify-between gap-24"
    >
      <div className="flex flex-row items-center gap-3">
        <div
          style={{
            backgroundColor: color,
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center border-[1px] border-[#E2E2E2]"
        >
          {icon}
        </div>
        <span className="text-base font-medium">{text}</span>
      </div>
      <Link
        href={link}
        target="_blank"
        className="px-8 flex py-1 text-sm rounded-full border-[1px] bg-white text-black border-[#E2E2E2]"
      >
        <span className="flex items-center justify-center">Follow</span>
      </Link>
    </div>
  );
}

export default function Socials({ links }: { links: any }) {
  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <button className="px-6 bg-white text-black flex items-center py-2 text-base rounded-full border-[1px] border-[#E2E2E2]">
          <span className="w-6">
            <svg
              width="100%"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1M9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1M9 17C7.13967 17 5.63158 13.4183 5.63158 9C5.63158 4.58172 7.13967 1 9 1M9 17C10.8603 17 12.3684 13.4183 12.3684 9C12.3684 4.58172 10.8603 1 9 1M16.5789 9H1.42105"
                stroke="black"
                strokeLinecap="square"
              />
            </svg>
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-4 flex flex-col gap-4">
        {links?.twitter && (
          <SocialLink
            color="#1D9BF0"
            icon={
              <svg
                width="20"
                viewBox="0 0 16 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.3193 3.51989C14.329 3.66882 14.329 3.81774 14.329 3.96803C14.329 8.54754 11.0515 13.8291 5.05865 13.8291V13.8264C3.28832 13.8291 1.55478 13.2897 0.0644531 12.2726C0.321872 12.3056 0.580582 12.3221 0.839937 12.3227C2.30703 12.3241 3.73219 11.8005 4.88639 10.8363C3.49219 10.8081 2.26961 9.84117 1.84252 8.4295C2.3309 8.5297 2.83413 8.50911 3.31349 8.3698C1.79349 8.04313 0.699937 6.62254 0.699937 4.97274V4.92882C1.15284 5.19715 1.65994 5.34607 2.17865 5.36254C0.747034 4.3448 0.305743 2.31891 1.17026 0.734992C2.82445 2.90019 5.2651 4.21646 7.8851 4.35578C7.62252 3.15205 7.98123 1.89068 8.82768 1.0445C10.1399 -0.267655 12.2038 -0.200401 13.4374 1.1948C14.167 1.04176 14.8664 0.756952 15.5064 0.353423C15.2632 1.15568 14.7541 1.83715 14.0741 2.27019C14.7199 2.18921 15.3509 2.00529 15.9451 1.7246C15.5077 2.42185 14.9567 3.02921 14.3193 3.51989Z"
                  fill="white"
                />
              </svg>
            }
            text="Twitter"
            link={`https://twitter.com/${links.twitter}`}
          />
        )}
        {links?.read_cv && (
          <SocialLink
            color="#fff"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                viewBox="0 0 28 28"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.809 5.242a1.25 1.25 0 00-1.531.884L6.042 18.2a1.25 1.25 0 00.884 1.53l9.66 2.59a1.25 1.25 0 001.53-.885l3.236-12.074a1.25 1.25 0 00-.884-1.53l-9.66-2.589zm-2.98.496a2.75 2.75 0 013.368-1.945l9.66 2.588A2.75 2.75 0 0122.8 9.75l-3.236 12.074a2.75 2.75 0 01-3.368 1.945L6.538 21.18a2.75 2.75 0 01-1.944-3.368L7.829 5.738z"
                  fill="#000"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.518 8.27a.75.75 0 01.919-.53l7.241 1.94a.75.75 0 01-.388 1.449l-7.242-1.94a.75.75 0 01-.53-.919zM9.677 11.41a.75.75 0 01.918-.531l7.242 1.94a.75.75 0 11-.388 1.45l-7.242-1.941a.75.75 0 01-.53-.919zM8.836 14.549a.75.75 0 01.918-.53l4.83 1.293a.75.75 0 11-.388 1.45l-4.83-1.295a.75.75 0 01-.53-.918z"
                  fill="#000"
                ></path>
              </svg>
            }
            text="Read CV"
            link={`https://read.cv/${links.read_cv}`}
          />
        )}
        {links?.linkedin && (
          <SocialLink
            color="#0a66c2"
            icon={
              <svg
                fill="#fff"
                height="18px"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 310 310"
              >
                <g id="XMLID_801_">
                  <path
                    id="XMLID_802_"
                    d="M72.16,99.73H9.927c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5H72.16c2.762,0,5-2.238,5-5V104.73
                   C77.16,101.969,74.922,99.73,72.16,99.73z"
                  />
                  <path
                    id="XMLID_803_"
                    d="M41.066,0.341C18.422,0.341,0,18.743,0,41.362C0,63.991,18.422,82.4,41.066,82.4
                   c22.626,0,41.033-18.41,41.033-41.038C82.1,18.743,63.692,0.341,41.066,0.341z"
                  />
                  <path
                    id="XMLID_804_"
                    d="M230.454,94.761c-24.995,0-43.472,10.745-54.679,22.954V104.73c0-2.761-2.238-5-5-5h-59.599
                   c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5h62.097c2.762,0,5-2.238,5-5v-98.918c0-33.333,9.054-46.319,32.29-46.319
                   c25.306,0,27.317,20.818,27.317,48.034v97.204c0,2.762,2.238,5,5,5H305c2.762,0,5-2.238,5-5V194.995
                   C310,145.43,300.549,94.761,230.454,94.761z"
                  />
                </g>
              </svg>
            }
            text="LinkedIn"
            link={`https://linkedin.com/in/${links.linkedin}`}
          />
        )}
        {links?.instagram && (
          <SocialLink
            color="#fd01c4"
            icon={<Instagram stroke="#fff" />}
            text="Instagram"
            link={`https://instagram.com/${links.instagram}`}
          />
        )}
        {links?.behance && (
          <SocialLink
            color="#1769FF"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                fill="#fff"
                viewBox="0 0 24 24"
              >
                <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
              </svg>
            }
            text="Behance"
            link={`https://behance.com/${links.behance}`}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
