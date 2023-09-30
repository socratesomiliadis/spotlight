import Link from "next/link";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  return (
    <div className="flex flex-col ">
      <span className="mb-6 text-sm text-softGray">{title}</span>
      {links.map((link, index) => (
        <Link className="text-black text-xl" key={index} href={link.href}>
          {link.name}
        </Link>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <div className="footer-wrapper w-full pb-12 px-6">
      <footer className="bg-[#F6F6F6] w-full flex flex-col justify-between rounded-2xl pt-20 pb-3 px-3">
        <div className="flex flex-row w-full justify-between">
          <div className="flex flex-row pl-24 gap-44">
            <FooterColumn
              title="Studio"
              links={[
                { name: "Websites", href: "/" },
                { name: "Start-Ups", href: "/" },
                { name: "NFT's", href: "/" },
                { name: "Crypto", href: "/" },
                { name: "Development", href: "/" },
              ]}
            />
            <FooterColumn
              title="Individual"
              links={[
                { name: "Creative Directors", href: "/" },
                { name: "Graphic Designers", href: "/" },
                { name: "Photographers", href: "/" },
                { name: "Films", href: "/" },
                { name: "Digital Characters", href: "/" },
              ]}
            />
            <FooterColumn
              title="Spotlight"
              links={[
                { name: "Subscribe", href: "/" },
                { name: "Sign Up", href: "/" },
                { name: "Log In", href: "/" },
                { name: "Privacy", href: "/" },
                { name: "Terms", href: "/" },
              ]}
            />
          </div>
          <div className="flex flex-col pr-24">
            <p className="text-6xl">
              Subscribe for daily
              <br />
              inspiration—no spam.
            </p>
            <span className="text-softGray mt-8">153 did today.</span>
            <div className="flex flex-row items-center mt-1 gap-3">
              <button className="px-24 py-3 bg-black text-white rounded-full">
                Subscribe
              </button>
              <Link
                href="/"
                className="rounded-full h-full py-3 px-6 bg-black text-white flex items-center gap-3"
              >
                <span className="w-5 block">
                  <svg
                    width="100%"
                    viewBox="0 0 18 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.0367 4.21124C16.0476 4.38294 16.0476 4.55464 16.0476 4.72792C16.0476 10.0078 12.3605 16.0971 5.61847 16.0971V16.094C3.62685 16.0971 1.67661 15.4752 0 14.3026C0.289597 14.3406 0.580645 14.3596 0.872419 14.3604C2.5229 14.362 4.12621 13.7583 5.42468 12.6466C3.85621 12.6141 2.48081 11.4993 2.00032 9.87172C2.54976 9.98724 3.11589 9.96351 3.65516 9.80289C1.94516 9.42626 0.714919 7.78841 0.714919 5.88628V5.83564C1.22444 6.14502 1.79492 6.31671 2.37847 6.3357C0.767903 5.1623 0.271452 2.82658 1.24403 1.00042C3.105 3.49676 5.85073 5.01434 8.79823 5.17496C8.50282 3.78714 8.90637 2.33285 9.85863 1.35726C11.3349 -0.155574 13.6568 -0.078033 15.0445 1.53054C15.8654 1.3541 16.6522 1.02574 17.3722 0.560492C17.0985 1.48544 16.5259 2.27114 15.7609 2.77041C16.4874 2.67704 17.1973 2.46499 17.8657 2.14138C17.3736 2.94527 16.7538 3.64551 16.0367 4.21124Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span className="w-[1px] h-5 bg-[#f6f6f6]"></span>
                <span className="w-5 h-4 block">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 15 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.0365715 0L5.8279 9.53872L0 17.2941H1.31163L6.41395 10.5041L10.5365 17.2941H15L8.88282 7.21884L14.3074 0H12.9958L8.29678 6.25341L4.50009 0H0.0365715ZM1.96542 1.19012H4.01597L13.0709 16.1038H11.0203L1.96542 1.19012Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </Link>{" "}
              <Link
                href="/"
                className="rounded-full aspect-square w-auto h-full p-3 bg-black text-white flex items-center justify-center"
              >
                <span className="w-5 block">
                  <svg
                    width="100%"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5 1.89193C13.3036 1.89193 13.6357 1.9026 14.7429 1.95312C15.7666 1.99984 16.3226 2.17089 16.6926 2.31465C17.1827 2.50512 17.5325 2.7327 17.8999 3.1001C18.2673 3.46751 18.4949 3.81733 18.6853 4.3074C18.8291 4.67743 19.0002 5.2334 19.0469 6.2571C19.0974 7.36432 19.1081 7.69639 19.1081 10.5C19.1081 13.3037 19.0974 13.6357 19.0469 14.7429C19.0002 15.7666 18.8291 16.3226 18.6853 16.6926C18.4949 17.1827 18.2673 17.5325 17.8999 17.8999C17.5325 18.2673 17.1827 18.4949 16.6926 18.6854C16.3226 18.8291 15.7666 19.0002 14.7429 19.0469C13.6358 19.0974 13.3038 19.1081 10.5 19.1081C7.69618 19.1081 7.36411 19.0974 6.2571 19.0469C5.23336 19.0002 4.67739 18.8291 4.3074 18.6854C3.81729 18.4949 3.46747 18.2673 3.10006 17.8999C2.73265 17.5325 2.50508 17.1827 2.31465 16.6926C2.17085 16.3226 1.9998 15.7666 1.95307 14.7429C1.90256 13.6357 1.89189 13.3037 1.89189 10.5C1.89189 7.69639 1.90256 7.36432 1.95307 6.25714C1.9998 5.2334 2.17085 4.67743 2.31465 4.3074C2.50508 3.81733 2.73265 3.46751 3.10006 3.1001C3.46747 2.7327 3.81729 2.50512 4.3074 2.31465C4.67739 2.17089 5.23336 1.99984 6.25706 1.95312C7.36428 1.9026 7.69634 1.89193 10.5 1.89193ZM10.5 0C7.64833 0 7.2908 0.0120871 6.17086 0.0631866C5.05322 0.114203 4.28998 0.291675 3.62206 0.551257C2.93159 0.819592 2.34603 1.17862 1.76231 1.76235C1.17858 2.34607 0.81955 2.93163 0.551216 3.6221C0.291634 4.29002 0.114161 5.05326 0.0631449 6.17091C0.0120455 7.2908 0 7.64837 0 10.5C0 13.3517 0.0120455 13.7092 0.0631449 14.8291C0.114161 15.9468 0.291634 16.71 0.551216 17.3779C0.81955 18.0684 1.17858 18.654 1.76231 19.2377C2.34603 19.8214 2.93159 20.1805 3.62206 20.4488C4.28998 20.7084 5.05322 20.8858 6.17086 20.9369C7.2908 20.988 7.64833 21 10.5 21C13.3516 21 13.7092 20.988 14.8291 20.9369C15.9467 20.8858 16.71 20.7084 17.3779 20.4488C18.0684 20.1805 18.6539 19.8214 19.2377 19.2377C19.8214 18.654 20.1804 18.0684 20.4487 17.3779C20.7083 16.71 20.8858 15.9468 20.9368 14.8291C20.9879 13.7092 21 13.3517 21 10.5C21 7.64837 20.9879 7.2908 20.9368 6.17091C20.8858 5.05326 20.7083 4.29002 20.4487 3.6221C20.1804 2.93163 19.8214 2.34607 19.2377 1.76235C18.6539 1.17862 18.0684 0.819592 17.3779 0.551257C16.71 0.291675 15.9467 0.114203 14.8291 0.0631866C13.7092 0.0120871 13.3516 0 10.5 0ZM10.5 5.10811C7.52212 5.10811 5.10807 7.52217 5.10807 10.5C5.10807 13.4779 7.52212 15.8919 10.5 15.8919C13.4778 15.8919 15.8919 13.4779 15.8919 10.5C15.8919 7.52217 13.4778 5.10811 10.5 5.10811ZM10.5 14C8.56699 14 6.99996 12.433 6.99996 10.5C6.99996 8.56704 8.56699 7 10.5 7C12.433 7 14 8.56704 14 10.5C14 12.433 12.433 14 10.5 14ZM17.3649 4.89509C17.3649 5.59097 16.8008 6.15511 16.1049 6.15511C15.409 6.15511 14.8449 5.59097 14.8449 4.89509C14.8449 4.1992 15.409 3.63511 16.1049 3.63511C16.8008 3.63511 17.3649 4.1992 17.3649 4.89509Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-16 w-full py-6 bg-white rounded-xl flex items-center justify-center">
          <span className="text-softGray text-sm">
            {new Date().getFullYear()} © Spotlight Gallery
          </span>
        </div>
      </footer>
    </div>
  );
}
