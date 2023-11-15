import Image from "next/image";
import { useRouter } from "next/router";
import { Price } from "@/types";

import { postData } from "@/utils/helpers";
import { getStripe } from "@/utils/stripe-client";
// import { useUser } from "@/utils/getUser";

export default function PlanItem({
  planName,
  priceNum,
  bgImage,
  badgeIcon,
  badgeBg,
  price,
}: {
  planName: string;
  priceNum: string;
  bgImage: string;
  badgeIcon: React.ReactNode;
  badgeBg: string;
  price: Price | undefined;
}) {
  const router = useRouter();
  // const { user, userDetails, subscription } = useUser();
  const handleCheckout = async () => {
    // setPriceIdLoading(price.id);
    // if (!user) {
    //   return router.push("/signin");
    // }
    // if (subscription) {
    //   return router.push("/account");
    // }
    // try {
    //   const { sessionId } = await postData({
    //     url: "/api/create-checkout-session",
    //     data: price ? { price } : undefined,
    //   });
    //   const stripe = await getStripe();
    //   stripe?.redirectToCheckout({ sessionId });
    // } catch (error) {
    //   return alert((error as Error)?.message);
    // } finally {
    //   //   setPriceIdLoading(undefined);
    // }
  };

  return (
    <div className="flex flex-row gap-8 h-[38vh] w-full relative">
      <div className="badge-div basis-1/3 rounded-3xl relative bg-black p-8 flex flex-col justify-between">
        <div className="absolute rounded-full z-20 bg-white aspect-square w-28 h-auto top-1/2 -translate-y-1/2 -right-[72px] flex items-center justify-center">
          <svg
            width="30"
            height="23"
            viewBox="0 0 30 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.2077 22.6468C19.2077 22.6468 26.7115 15.2457 29.6333 12.3641C29.8783 12.1243 30 11.8088 30 11.4934C30 11.178 29.8783 10.8626 29.6333 10.6227C26.7132 7.74114 19.2261 0.356502 19.2261 0.356502C18.9861 0.119931 18.6694 0.00164332 18.3544 1.10505e-06C18.0327 1.11912e-06 17.711 0.121574 17.4643 0.363073C16.9759 0.84443 16.9743 1.6215 17.4576 2.09957L25.7381 10.2613L1.25007 10.2613C0.560031 10.2613 -5.32699e-07 10.8133 -5.02969e-07 11.4934C-4.73239e-07 12.1736 0.560031 12.7256 1.25007 12.7256L25.7381 12.7256L17.441 20.9053C16.9593 21.3801 16.9626 22.1556 17.451 22.6369C17.6977 22.8801 18.0193 23.0016 18.341 23C18.656 23 18.9694 22.8833 19.2077 22.6468Z"
              fill="black"
            />
          </svg>
        </div>
        <span className="py-2 rounded-full select-none text-sm w-fit flex px-10 bg-[#8a8a8a]/50 text-white">
          <span className="">{planName} Plan</span>
        </span>
        <div className="flex flex-col gap-6">
          <span className="badge-box p-1 w-20 h-20 bg-[#8a8a8a]/50 rounded-lg flex items-center justify-center">
            <span
              style={{ backgroundColor: badgeBg }}
              className="inner w-full h-full bg-white z-10 rounded-lg flex items-center justify-center"
            >
              {badgeIcon}
            </span>
          </span>
          <span className="flex flex-col">
            <span className="text-2xl text-white leading-none ">
              {planName} Badge
            </span>
            <span className="text-lg text-[#8a8a8a]">by Spotlight</span>
          </span>
        </div>
      </div>
      <div className="price-div p-8 flex flex-row items-start z-10 basis-2/3 rounded-3xl bg-black relative overflow-hidden">
        <span className="py-2 rounded-full z-10 select-none text-sm w-fit flex px-10 bg-[#8a8a8a]/50 text-white">
          <span className="">Price</span>
        </span>
        <div className="absolute z-10 flex flex-col items-center gap-6 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center">
            <span className="text-7xl font-medium text-white">ONLY</span>
            <span className="text-5xl font-medium text-white">${priceNum}</span>
            <span className="text-lg text-[#8f8f8f]">per month</span>
          </div>
          <div className="flex flex-row items-center gap-3">
            <button className="px-8 flex py-2 text-white border-[1px] border-white text-base rounded-full items-center gap-4">
              <span className="">Details</span>
              <svg
                width="14"
                viewBox="0 0 30 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.2077 22.6468C19.2077 22.6468 26.7115 15.2457 29.6333 12.3641C29.8783 12.1243 30 11.8088 30 11.4934C30 11.178 29.8783 10.8626 29.6333 10.6227C26.7132 7.74114 19.2261 0.356502 19.2261 0.356502C18.9861 0.119931 18.6694 0.00164332 18.3544 1.10505e-06C18.0327 1.11912e-06 17.711 0.121574 17.4643 0.363073C16.9759 0.84443 16.9743 1.6215 17.4576 2.09957L25.7381 10.2613L1.25007 10.2613C0.560031 10.2613 -5.32699e-07 10.8133 -5.02969e-07 11.4934C-4.73239e-07 12.1736 0.560031 12.7256 1.25007 12.7256L25.7381 12.7256L17.441 20.9053C16.9593 21.3801 16.9626 22.1556 17.451 22.6369C17.6977 22.8801 18.0193 23.0016 18.341 23C18.656 23 18.9694 22.8833 19.2077 22.6468Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button
              onClick={() => handleCheckout()}
              className="px-8 flex py-2 text-black bg-white text-base rounded-full items-center gap-4"
            >
              <span className="">Buy Now</span>
              <svg
                width="14"
                viewBox="0 0 30 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.2077 22.6468C19.2077 22.6468 26.7115 15.2457 29.6333 12.3641C29.8783 12.1243 30 11.8088 30 11.4934C30 11.178 29.8783 10.8626 29.6333 10.6227C26.7132 7.74114 19.2261 0.356502 19.2261 0.356502C18.9861 0.119931 18.6694 0.00164332 18.3544 1.10505e-06C18.0327 1.11912e-06 17.711 0.121574 17.4643 0.363073C16.9759 0.84443 16.9743 1.6215 17.4576 2.09957L25.7381 10.2613L1.25007 10.2613C0.560031 10.2613 -5.32699e-07 10.8133 -5.02969e-07 11.4934C-4.73239e-07 12.1736 0.560031 12.7256 1.25007 12.7256L25.7381 12.7256L17.441 20.9053C16.9593 21.3801 16.9626 22.1556 17.451 22.6369C17.6977 22.8801 18.0193 23.0016 18.341 23C18.656 23 18.9694 22.8833 19.2077 22.6468Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
        <Image
          src={bgImage}
          width={1000}
          height={584}
          alt=""
          className="absolute left-1/2 -translate-x-1/2 inset-0 object-cover z-0"
        />
      </div>
    </div>
  );
}
