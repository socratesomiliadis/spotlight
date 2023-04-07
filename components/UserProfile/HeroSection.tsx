import Image from "next/image";
import { motion } from "framer-motion";
import LoadingLine from "../LoadingLine";

export default function HeroSection({
  bannerUrl,
  profileImg,
  profileLoaded,
  firstName,
  lastName,
}: {
  bannerUrl: string;
  profileImg: string;
  profileLoaded: boolean;
  firstName: string;
  lastName: string;
}) {
  return (
    <section className="hero-section-profile w-full flex flex-col items-start">
      <div className="banner relative bg-[#F4F4F4] text-black/50 w-full aspect-[1920/300] h-auto bg-cover bg-center bg-no-repeat flex items-center justify-center">
        {profileLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.35, ease: "easeOut" },
            }}
          >
            <Image
              src={bannerUrl ? bannerUrl : "/static/images/defaultBanner.png"}
              width={1920 * 1.5}
              height={300 * 1.5}
              quality={100}
              alt=""
              className="absolute inset-0 z-0 object-cover object-center w-full h-full"
            />
          </motion.div>
        )}
      </div>
      <div className="info-section flex flex-col gap-8 w-full items-center -mt-[100px]">
        <div className="z-[1] profile-image aspect-square w-[200px] h-[200px] bg-white flex items-center justify-center rounded-full">
          <div className="w-[160px] h-[160px] bg-[#f4f4f4] rounded-full">
            {profileLoaded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.35, ease: "easeOut" },
                }}
              >
                <Image
                  src={profileImg}
                  width={160}
                  height={160}
                  alt=""
                  className="rounded-full"
                />
              </motion.div>
            )}
          </div>
        </div>
        <h1 className="text-black text-4xl font-medium flex flex-row items-center gap-4">
          {profileLoaded ? (
            <span className="-mb-[0.3rem]">
              {firstName} {lastName}
            </span>
          ) : (
            <div className="relative flex items-center">
              <div className="absolute w-full">
                <LoadingLine className="w-full h-[36px] rounded-lg" />
              </div>
              <span
                aria-hidden
                className="text-4xl pointer-events-none opacity-0"
              >
                Socrates Chrysafidis
              </span>
            </div>
          )}
          <svg
            width="35"
            viewBox="0 0 33 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.31521 19.6804L2.9915 21.3536C3.40422 21.7651 3.63577 22.3242 3.63448 22.9071V24.8673C3.63576 26.06 4.11016 27.2033 4.95334 28.0467C5.79648 28.8901 6.93956 29.3647 8.13223 29.3663H10.0925C10.6743 29.3683 11.232 29.5994 11.6445 30.0095L13.3193 31.6843C14.1634 32.5269 15.3073 33 16.5 33C17.6927 33 18.8365 32.5269 19.6807 31.6843L21.354 30.0095C21.7672 29.5996 22.3252 29.3686 22.9074 29.3663H24.8693C26.0617 29.3648 27.205 28.8901 28.0482 28.0467C28.8913 27.2033 29.3657 26.06 29.3667 24.8673V22.9071C29.3657 22.3242 29.5973 21.7651 30.01 21.3536L31.6848 19.6804C32.5269 18.836 33 17.6921 33 16.4997C33 15.3073 32.5269 14.1635 31.6848 13.319L30.0085 11.6458C29.5958 11.2344 29.3642 10.6752 29.3655 10.0924V8.13213C29.3642 6.93948 28.8898 5.79616 28.0466 4.95277C27.2035 4.10938 26.0604 3.63473 24.8677 3.63315H22.9074C22.3259 3.63135 21.7683 3.40084 21.3555 2.99147L19.6807 1.31522C18.8363 0.473075 17.6924 0 16.5 0C15.3076 0 14.1637 0.473101 13.3192 1.31522L11.646 2.99147C11.2328 3.40136 10.6748 3.63238 10.0925 3.63443H8.13071C6.9383 3.63623 5.79496 4.11088 4.95182 4.95425C4.10868 5.79765 3.63427 6.94096 3.63322 8.13361V10.0923C3.63451 10.6749 3.40373 11.234 2.99153 11.6457L1.31524 13.319C0.473084 14.1634 0 15.3072 0 16.4996C0 17.692 0.47311 18.8359 1.31524 19.6803L1.31521 19.6804ZM11.0815 15.6892C11.2971 15.4734 11.5898 15.3518 11.8951 15.3518C12.2004 15.3518 12.4931 15.4734 12.7087 15.6892L14.9653 17.9411L20.2919 12.616C20.5859 12.3423 21.0011 12.2413 21.3879 12.35C21.7744 12.4584 22.0766 12.7607 22.1853 13.1474C22.2938 13.5342 22.1928 13.9494 21.9191 14.2432L15.7789 20.3832V20.3835C15.5633 20.5996 15.2706 20.7214 14.9653 20.7214C14.6598 20.7214 14.3671 20.5996 14.1517 20.3835L11.0815 17.3133C10.8656 17.0977 10.7441 16.805 10.7441 16.4997C10.7441 16.1944 10.8656 15.9017 11.0815 15.6861L11.0815 15.6892Z"
              fill="url(#paint0_linear_180_196)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_180_196"
                x1="2.34448"
                y1="5.15776"
                x2="30.4778"
                y2="30.0093"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#1400FF" />
                <stop offset="1" stop-color="#0075FF" />
              </linearGradient>
            </defs>
          </svg>
        </h1>
      </div>
    </section>
  );
}
