import Image from "next/image";
import FollowBtn from "./FollowBtn";
import { useUser } from "@clerk/nextjs";
import Socials from "./Socials";

export default function BannerAndInfo({
  otherUserId,
  bannerUrl,
  profileImg,
  profileLoaded,
  username,
  displayName,
  tagline,
  socials,
}: {
  otherUserId: string;
  bannerUrl: string;
  profileImg: string;
  profileLoaded: boolean;
  username: string;
  displayName: string;
  tagline: string;
  socials: any;
}) {
  const { user } = useUser();

  return (
    <div className="relative flex flex-col overflow-hidden bg-[#F6F6F6] rounded-3xl">
      <div className="relative banner-wrapper z-[1]">
        <Image
          src={profileImg}
          width={160}
          height={160}
          alt=""
          className="absolute bottom-[-1vw] left-1/2 -translate-x-1/2 outline-[0.8vw] outline outline-[#F6F6F6] z-[1] profile-image rounded-full w-[8vw] h-[8vw] bg-[#f4f4f4]"
        />
        <Image
          src={bannerUrl ? bannerUrl : "/static/images/defaultBanner.png"}
          width={1920 * 1.5}
          height={300 * 1.5}
          quality={100}
          alt=""
          className="aspect-[1920/280] w-full h-auto object-cover object-center"
        />
      </div>
      <div className="relative info-wrapper w-full flex flex-col items-center z-[2] pt-10 pb-6">
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center gap-2">
            <h1 className="text-black text-2xl 3xl:text-3xl font-medium">
              {displayName}
            </h1>
            <span className="text-black w-4 -mb-[0.125rem]">
              <svg
                width="100%"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.597825 8.94564L1.35977 9.70619C1.54737 9.89321 1.65262 10.1474 1.65204 10.4123V11.3033C1.65262 11.8454 1.86826 12.3651 2.25152 12.7485C2.63476 13.1318 3.15434 13.3476 3.69647 13.3483H4.58751C4.85198 13.3493 5.10545 13.4543 5.29294 13.6407L6.05421 14.4019C6.43793 14.785 6.95787 15 7.5 15C8.04212 15 8.56206 14.785 8.94578 14.4019L9.70636 13.6407C9.89419 13.4544 10.1478 13.3494 10.4125 13.3483H11.3042C11.8462 13.3476 12.3659 13.1319 12.7492 12.7485C13.1324 12.3651 13.348 11.8454 13.3485 11.3033V10.4123C13.3481 10.1474 13.4533 9.89321 13.6409 9.70619L14.4022 8.94564C14.785 8.5618 15 8.04187 15 7.49988C15 6.95788 14.7849 6.43795 14.4022 6.05411L13.6402 5.29356C13.4526 5.10654 13.3474 4.85236 13.348 4.58745V3.69642C13.3474 3.15431 13.1317 2.63462 12.7485 2.25126C12.3652 1.8679 11.8456 1.65215 11.3035 1.65143H10.4125C10.1481 1.65061 9.89466 1.54584 9.70704 1.35976L8.94578 0.597825C8.56194 0.215034 8.042 0 7.49999 0C6.95799 0 6.43805 0.215046 6.0542 0.597825L5.29363 1.35976C5.1058 1.54607 4.85219 1.65108 4.58751 1.65202H3.69578C3.15377 1.65283 2.63407 1.86858 2.25083 2.25193C1.86758 2.63529 1.65194 3.15498 1.65146 3.6971V4.58741C1.65205 4.85221 1.54715 5.10638 1.35979 5.29351L0.597837 6.05407C0.215038 6.43791 0 6.95783 0 7.49983C0 8.04183 0.21505 8.56175 0.597837 8.94559L0.597825 8.94564ZM5.03705 7.13147C5.13505 7.03335 5.2681 6.9781 5.40687 6.9781C5.54563 6.9781 5.67869 7.03335 5.77669 7.13147L6.80242 8.15505L9.22358 5.73454C9.35721 5.61013 9.54597 5.56423 9.72178 5.61364C9.89746 5.66293 10.0348 5.8003 10.0842 5.9761C10.1335 6.15189 10.0876 6.34065 9.96322 6.47416L7.17224 9.26509V9.26521C7.07424 9.36345 6.94119 9.41881 6.80242 9.41881C6.66353 9.41881 6.53048 9.36344 6.4326 9.26521L5.03705 7.86968C4.93893 7.77168 4.88368 7.63863 4.88368 7.49987C4.88368 7.36111 4.93893 7.22806 5.03705 7.13006L5.03705 7.13147Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </div>
          <p className="text-[#ACACAC] mb-6">{tagline}</p>
          {!!user && (
            <FollowBtn otherUserId={otherUserId} currentUserId={user?.id} />
          )}
        </div>
      </div>
      <div className="other-info-wrapper p-2">
        <div className="w-full bg-white rounded-2xl flex flex-col items-center gap-6 py-12">
          <div className="flex flex-row gap-4">
            <button className="px-6 cursor-not-allowed flex flex-row items-center gap-2 relative bg-white text-black py-1 text-lg rounded-full border-[1px] border-[#E2E2E2]">
              <span className="w-3">
                <svg
                  width="100%"
                  viewBox="0 0 11 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.9726 0C3.47463 0 2.26027 1.20883 2.26027 2.7C2.26027 4.19117 3.47463 5.4 4.9726 5.4C6.47058 5.4 7.68493 4.19117 7.68493 2.7C7.68493 1.20883 6.47058 0 4.9726 0Z"
                    fill="#FA5A59"
                  />
                  <path
                    d="M0.00198615 10.9079C0.243944 8.3458 2.19045 6.3 4.9726 6.3C6.01488 6.3 6.93987 6.58712 7.7019 7.08094C7.50325 7.31577 7.38356 7.61897 7.38356 7.95V8.4H6.93151C6.18252 8.4 5.57534 9.00442 5.57534 9.75C5.57534 10.4956 6.18252 11.1 6.93151 11.1H7.38356V11.4H0.452056C0.324805 11.4 0.203447 11.3466 0.117781 11.2529C0.032115 11.1593 -0.0099241 11.034 0.00198615 10.9079Z"
                    fill="#FA5A59"
                  />
                  <path
                    d="M9.19178 7.95C9.19178 7.70147 8.98939 7.5 8.73973 7.5C8.49006 7.5 8.28767 7.70147 8.28767 7.95V9.3H6.93151C6.68184 9.3 6.47945 9.50147 6.47945 9.75C6.47945 9.99853 6.68184 10.2 6.93151 10.2H8.28767V11.55C8.28767 11.7985 8.49006 12 8.73973 12C8.98939 12 9.19178 11.7985 9.19178 11.55V10.2H10.5479C10.7976 10.2 11 9.99853 11 9.75C11 9.50147 10.7976 9.3 10.5479 9.3H9.19178V7.95Z"
                    fill="#FA5A59"
                  />
                </svg>
              </span>
              <span className="text-[#FA5A59] font-medium flex items-center justify-center">
                Hire
              </span>
            </button>
            <button className="px-6 cursor-not-allowed flex flex-row items-center gap-2 relative bg-white text-black py-1 text-base rounded-full border-[1px] border-[#E2E2E2]">
              <span className="w-4">
                <svg
                  width="100%"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.97763 1.25067C6.73734 0.749778 6.02338 0.749775 5.78309 1.25067L4.45241 4.02448L1.38951 4.42608C0.838053 4.49838 0.614084 5.17876 1.02074 5.56273L3.25959 7.67671L2.69748 10.6962C2.59519 11.2456 3.17613 11.6622 3.66353 11.3991L6.38036 9.93241L9.09719 11.3991C9.58458 11.6622 10.1655 11.2456 10.0632 10.6962L9.50113 7.67671L11.74 5.56273C12.1466 5.17877 11.9227 4.49838 11.3712 4.42608L8.3083 4.02448L6.97763 1.25067Z"
                    fill="#F8BA0A"
                  />
                </svg>
              </span>
              <span className="text-black font-semibold flex items-center justify-center">
                4.5/5
              </span>
            </button>
            <Socials links={socials} />
          </div>
          <p className="text-center text-black text-2xl font-medium w-1/3">
            An award-winning designer, based in Thessaloniki, Greece. Lead
            metaverse director at 1UP Nova.
          </p>
        </div>
      </div>
    </div>
  );
}
