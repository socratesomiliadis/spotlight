import { Tables } from "@/database.types";

export default function ProfileNavigation() {
  return (
    <div className="flex items-center justify-between mb-8 border-y-[1px] border-[#EAEAEA] px-8 py-4">
      <div className="flex items-center gap-2 font-medium tracking-tight">
        <button className="flex items-center gap-2 bg-transparent text-[#989898] border-[2px] box-border border-[#F6F6F6] px-5 py-2 rounded-lg">
          <span className="size-4 flex">
            <svg
              width="100%"
              viewBox="0 0 11 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.45426 0.671875V4.75932M8.45426 4.75932C7.48679 4.75932 6.7025 5.54362 6.70249 6.51109V7.09501C6.70249 8.06248 7.48679 8.84677 8.45426 8.84677C9.42173 8.84677 10.206 8.06248 10.206 7.09501V6.51109C10.206 5.54362 9.42173 4.75932 8.45426 4.75932ZM2.61505 8.26285L2.61505 11.1825M8.45426 10.5985V11.1825M2.61505 0.671875L2.61505 2.42364M2.61505 2.42364C1.64757 2.42364 0.863281 3.20793 0.863281 4.1754L0.863281 4.75932C0.863281 5.7268 1.64757 6.51109 2.61505 6.51109C3.58252 6.51109 4.36681 5.7268 4.36681 4.75932V4.1754C4.36681 3.20793 3.58252 2.42364 2.61505 2.42364Z"
                stroke="currentColor"
                strokeWidth="1.16784"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>Filter</span>
        </button>
        <button className="flex items-center gap-2 bg-[#f6f6f6] text-[#989898] px-5 py-2 rounded-lg">
          <span className="size-4 flex">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 800 800"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path
                  d="M750 50H600C600 22.3125 577.637 0 550 0H250C222.363 0 200 22.3125 200 50H50C22.3625 50 0 72.3125 0 100V200C0 310.45 89.55 400 200 400C202.35 400 204.538 399.362 206.838 399.262C224.8 469.625 279.738 524.663 350 542.875V700H250C222.363 700 200 722.313 200 750V800H600V750C600 722.313 577.637 700 550 700H450V542.875C520.262 524.663 575.2 469.637 593.162 399.275C595.462 399.362 597.65 400 600 400C710.45 400 800 310.45 800 200V100C800 72.3125 777.637 50 750 50ZM100 200V150H200V300C144.775 300 100 255.175 100 200ZM700 200C700 255.175 655.225 300 600 300V150H700V200Z"
                  fill="currentColor"
                />
              </g>
            </svg>
          </span>
          <span>Awards</span>
        </button>
        <button className="flex items-center gap-2 bg-[#f6f6f6] text-[#989898] px-5 py-2 rounded-lg">
          <span className="size-[1.1rem] flex">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 16 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 10.5264 14.8289 12.7793 13 14.2454V20.0353C13 21.3362 11.631 22.1823 10.4674 21.6006L8 20.3669L5.53262 21.6006C4.36905 22.1823 3 21.3362 3 20.0353V14.2454C1.17108 12.7793 0 10.5264 0 8ZM5 15.4185V19.6308L7.21738 18.5221C7.71005 18.2758 8.28995 18.2758 8.78262 18.5221L11 19.6308V15.4185C10.0736 15.7935 9.0609 16 8 16C6.9391 16 5.92643 15.7935 5 15.4185Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span>Honorable Mentions</span>
        </button>
      </div>
    </div>
  );
}
