import CustomButton from "@/components/custom-button"
import GradientText from "@/components/gradient-text"
import PageWrapper from "@/components/page-wrapper"
import SpotlightLogo from "@/components/SVGs/spotlight-logo"

export default function PremiumPage() {
  return (
    <PageWrapper
      wrapperClassName="h-svh py-20 overflow-hidden lg:py-0 flex items-center justify-center"
      className="w-full h-fit lg:h-auto lg:aspect-[16/10] flex flex-col lg:flex-row items-center justify-between p-3 lg:p-7 lg:-mt-12"
    >
      <div className="lg:basis-[62%] flex flex-col lg:h-full justify-between order-2 lg:order-1 mt-6 lg:mt-0">
        <h2 className="text-2xl lg:text-3xl tracking-tight leading-none no-mobile-br">
          Ideal subscription for <br />
          freelancers, creative studios <br />
          and entrepreneurs.
        </h2>
        <div className="mt-6 lg:mt-0">
          <span className="block w-20 text-black">
            <SpotlightLogo />
          </span>
          <p className="mt-2 text-base leading-none tracking-tight text-[#ACACAC] no-mobile-br">
            We are a company based in Dubai, and this <br />
            subscription is solely for our internal use to stay <br />
            updated with this website and its services.
          </p>
        </div>
      </div>
      <div className="relative w-full lg:w-fit bg-[#1e1e1e] lg:h-full rounded-3xl p-7 lg:p-10 flex flex-col items-center justify-center order-1 lg:order-2">
        <GradientText
          colorInitial="#ffffff"
          colorAccent="#FF77FA"
          colorFinal="#FFFFFF"
        >
          <h1 className="text-8xl lg:text-9xl font-black test-cond text-[#ffffff]">
            $3.88
          </h1>
          <p className="text-center tracking-tight text-[#ffffff] text-lg">
            per month
          </p>
        </GradientText>
        <div className="lg:absolute bottom-10 flex flex-row items-center gap-2 mt-8 lg:mt-0">
          <CustomButton text="Benefits" className="text-[#1e1e1e] bg-white" />
          <CustomButton
            text="Subscribe"
            className="text-[#1e1e1e] bg-[#FF98FB]"
          />
        </div>
      </div>
      {/* <div className="absolute left-0 top-0 w-[548px] h-full p-4 md:p-8 flex flex-col justify-between">
        <div className="mt-6">
          <h1 className="text-[26.67px] leading-[0.865] tracking-[-3%] font-normal text-black max-w-[318px]">
            Ideal subscription for freelancers, creative studios and
            entrepreneurs.
          </h1>
        </div>

        <div className="mb-8">
          <div className="flex items-start gap-3">
            <div className="flex flex-col gap-0.5 mt-0.5 flex-shrink-0">
              <div className="w-[9px] h-[4.5px] bg-black" />
              <div className="w-[9px] h-[4.24px] bg-black" />
            </div>

            <div>
              <div className="text-[11.89px] font-medium tracking-[-3%] text-black mb-2">
                spotlight
              </div>
              <p className="text-[11.42px] leading-[1.028] tracking-[-3%] text-[#ACACAC] max-w-[229px]">
                We are a company based in Dubai, and this subscription is solely
                for our internal use to stay updated with this website and its
                services.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-[19px] top-[19px] w-[333px] h-[502px] bg-[#1E1E1E] rounded-[30px]">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-[119.34px] leading-[1.202] tracking-[-3%] font-normal text-white mb-2">
            $3.88
          </div>
          <div className="text-[19.38px] leading-[0.865] tracking-[-3%] text-[#EAEAEA]">
            per month
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
          <button className="bg-white text-[#1E1E1E] px-6 py-2 rounded-[5px] text-[12.28px] leading-[1.173] tracking-[-3%] font-normal">
            Benefits
          </button>
          <button className="bg-[#FF77FA] text-[#1E1E1E] px-6 py-2 rounded-[5px] text-[12.28px] leading-[1.173] tracking-[-3%] font-normal">
            Subscribe
          </button>
        </div>
      </div> */}
    </PageWrapper>
  )
}
