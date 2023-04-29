import PlanItem from "./PlanItem";
import { Price } from "@/types";

export default function IndividualSection({ prices }: { prices: Price[] }) {
  const basicPrice = prices.find(
    (price) => price.id === "price_1N1UnzJ6EXBUMuQ2qAmzILht"
  );
  const proPrice = prices.find(
    (price) => price.id === "price_1N1UoPJ6EXBUMuQ2qcgGf8kG"
  );
  return (
    <section className="individual-subscribe w-screen pt-64 px-[5vw] xl:px-[10vw] 2xl:px-[15vw]">
      <div className="flex flex-col gap-3">
        <span className="text-base uppercase text-[#8F8F8F]">
          INDIVIDUAL SUBSCRIPTIONS
        </span>
        <h2 className="text-2xl text-black">Upgrade Your Experience</h2>
        <p className="text-2xl text-[#8F8F8F]">
          As a subscriber, you can upload your projects to our platform <br />
          and gain exposure to a wider audience of potential clients.
        </p>
      </div>
      <div className="mt-32 flex flex-col w-full">
        <PlanItem
          planName="Basic"
          badgeIcon={
            <svg
              width="35"
              height="35"
              viewBox="0 0 35 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.39493 20.8731L3.17281 22.6478C3.61054 23.0841 3.85612 23.6772 3.85475 24.2954V26.3744C3.85611 27.6394 4.35926 28.852 5.25354 29.7465C6.14779 30.641 7.36013 31.1444 8.6251 31.1461H10.7042C11.3213 31.1482 11.9127 31.3933 12.3502 31.8283L14.1265 33.6045C15.0218 34.4983 16.235 35 17.5 35C18.765 35 19.9781 34.4982 20.8735 33.6045L22.6482 31.8283C23.0864 31.3935 23.6782 31.1485 24.2958 31.1461H26.3765C27.6412 31.1444 28.8538 30.641 29.748 29.7465C30.6423 28.852 31.1454 27.6394 31.1466 26.3744V24.2954C31.1455 23.6772 31.391 23.0842 31.8288 22.6478L33.605 20.8731C34.4982 19.9775 35 18.7644 35 17.4997C35 16.2351 34.4982 15.0219 33.605 14.1263L31.8272 12.3516C31.3894 11.9153 31.1439 11.3222 31.1452 10.7041V8.62499C31.1439 7.36005 30.6407 6.14745 29.7464 5.25294C28.8522 4.35844 27.6398 3.85502 26.3749 3.85334H24.2958C23.679 3.85143 23.0875 3.60696 22.6498 3.17277L20.8735 1.39493C19.9779 0.501746 18.7647 0 17.5 0C16.2353 0 15.0221 0.501774 14.1265 1.39493L12.3518 3.17277C11.9135 3.6075 11.3218 3.85253 10.7042 3.8547H8.62348C7.3588 3.85661 6.14617 4.36002 5.25193 5.25451C4.35769 6.14902 3.85453 7.36162 3.85342 8.62656V10.7039C3.85478 11.3218 3.61002 11.9149 3.17283 12.3515L1.39495 14.1262C0.501756 15.0218 0 16.2349 0 17.4996C0 18.7643 0.501784 19.9774 1.39495 20.873L1.39493 20.8731ZM11.7531 16.6401C11.9818 16.4111 12.2922 16.2822 12.616 16.2822C12.9398 16.2822 13.2503 16.4111 13.4789 16.6401L15.8723 19.0285L21.5217 13.3806C21.8335 13.0903 22.2739 12.9832 22.6841 13.0985C23.0941 13.2135 23.4146 13.534 23.5299 13.9442C23.6449 14.3544 23.5378 14.7948 23.2475 15.1064L16.7352 21.6185V21.6188C16.5066 21.848 16.1961 21.9772 15.8723 21.9772C15.5482 21.9772 15.2378 21.848 15.0094 21.6188L11.7531 18.3626C11.5242 18.1339 11.3952 17.8235 11.3952 17.4997C11.3952 17.1759 11.5242 16.8655 11.7531 16.6368L11.7531 16.6401Z"
                fill="url(#paint0_linear_329_18134)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_329_18134"
                  x1="2.48657"
                  y1="5.47035"
                  x2="32.3249"
                  y2="31.8281"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#1400FF" />
                  <stop offset="1" stopColor="#0075FF" />
                </linearGradient>
              </defs>
            </svg>
          }
          priceNum="2,99"
          bgImage="/static/images/whiteLight.png"
          badgeBg="#fff"
          price={basicPrice}
        />
      </div>
    </section>
  );
}
