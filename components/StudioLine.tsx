import Image from "next/image";
import Link from "next/link";

export default function StudioLine({
  image,
  title,
  link,
  type,
  numOfAwards,
}: {
  image: string;
  title: string;
  link: string;
  type: "Individual" | "Studio" | "Freelancer";
  numOfAwards: number;
}) {
  return (
    <Link
      href={link}
      className="w-full studio-line flex flex-row items-center justify-between py-6"
    >
      <div className="flex flex-row items-center">
        <div className="arrow-div relative w-[24px] max-w-[0px]">
          <svg
            width="100%"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.2534 20.4842L12.464 22L21.6826 11.7579C22.1058 11.3072 22.1058 10.6928 21.6826 10.2421L12.464 0L10.2534 1.51576L17.6847 9.79139H0V12.2496H17.6847L10.2534 20.4842Z"
              fill="black"
            />
          </svg>
        </div>

        <span className="aspect-square w-[80px] h-auto mr-6">
          <Image
            src={image}
            width={260}
            height={260}
            alt=""
            className="w-full h-full object-cover"
          />
        </span>
        <span className="text-2xl font-medium">{title}</span>
      </div>
      <div className="flex flex-row items-center gap-6 font-medium text-xl">
        <span className="rounded-full flex px-10 py-3 border-[1px] border-black opacity-70">
          <span className="">{type}</span>
        </span>
        <span className="rounded-full flex px-10 py-3 border-[1px] border-black">
          <span className="">{`${numOfAwards} Awards`}</span>
        </span>
      </div>
    </Link>
  );
}
