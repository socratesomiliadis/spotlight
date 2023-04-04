import MonthsFilter from '../MonthsFilter';
import AwardsSlider from './AwardsSlider';

export default function ExploreAwards() {
  return (
    <section className="flex flex-col gap-24 items-start justify-center w-screen bg-white px-44 py-32">
      <div className="flex flex-col gap-3">
        <span className="text-base uppercase text-[#8F8F8F]">
          Explore Awards
        </span>
        <h2 className="text-3xl text-black">Websites of the Day</h2>
        <p className="text-3xl text-[#8F8F8F]">
          An award is a recognition given to outstanding websites <br /> that
          provide exceptional content, design, and user experience.
        </p>
      </div>
      <div className="w-full flex flex-col gap-16">
        <div className="flex flex-row w-full">
          <div className="basis-3/4">
            <MonthsFilter />
          </div>
        </div>
        <AwardsSlider />
      </div>
    </section>
  );
}
