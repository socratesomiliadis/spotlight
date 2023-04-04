import StudioLine from '../StudioLine';

export default function FeaturedStudios() {
  const Studios = [
    {
      image: '/static/images/temp/studios/1up.png',
      title: '1UP Nova',
      link: '/1up-nova',
      type: 'Studio' as 'Individual' | 'Studio' | 'Freelancer',
      numOfAwards: 32
    },
    {
      image: '/static/images/temp/studios/kommi.png',
      title: 'Kommigraphics',
      link: '/kommigraphics',
      type: 'Studio' as 'Individual' | 'Studio' | 'Freelancer',
      numOfAwards: 28
    },
    {
      image: '/static/images/temp/studios/baunfire.png',
      title: 'Baunfire',
      link: '/baunfire',
      type: 'Studio' as 'Individual' | 'Studio' | 'Freelancer',
      numOfAwards: 21
    },
    {
      image: '/static/images/temp/studios/scrum.png',
      title: 'ScrumLaunch',
      link: '/scrumlaunch',
      type: 'Studio' as 'Individual' | 'Studio' | 'Freelancer',
      numOfAwards: 14
    }
  ];
  return (
    <section className="flex flex-col gap-24 items-start justify-center w-screen bg-white px-44 py-32">
      <div className="flex flex-col gap-3">
        <span className="text-base uppercase text-[#8F8F8F]">
          Explore Studios
        </span>
        <h2 className="text-3xl text-black">Studios with the most awards</h2>
        <p className="text-3xl text-[#8F8F8F]">
          The Creative Studios with the most awards in the spotlight <br />
          community.
        </p>
      </div>
      <div className="flex flex-col w-full">
        <span className="w-full bg-[#E2E2E2] h-[1px]"></span>
        {Studios.map((studio, index) => (
          <div key={index} className="flex flex-col">
            <StudioLine
              title={studio.title}
              image={studio.image}
              type={studio.type}
              numOfAwards={studio.numOfAwards}
              link={studio.link}
            />
            <span className="w-full bg-[#E2E2E2] h-[1px]"></span>
          </div>
        ))}
      </div>
    </section>
  );
}
