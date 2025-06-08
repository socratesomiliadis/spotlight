import { auth, clerkClient } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Heart,
  MapPin,
  ExternalLink,
  Filter,
  Award,
  Star,
  Linkedin,
  Instagram,
  Twitter,
  TrophyIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UsernamePage({ params }: PageProps) {
  const { username } = await params;
  const { userId } = await auth();

  // Get user by username
  let user;
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("username", username)
      .single();

    if (error) {
      console.log(error);
      notFound();
    }

    user = data;
  } catch (error) {
    notFound();
  }

  if (!user) {
    notFound();
  }

  const isOwnProfile = userId === user.id;
  const displayName = user.display_name || user.username || "User";

  return (
    <main className="w-screen px-[25vw] py-28">
      <div className="w-full min-h-screen rounded-3xl border-[1px] border-[#EAEAEA] flex flex-col">
        <div className="flex flex-col p-3">
          <div className="w-full aspect-[3/1] bg-[#f6f6f6] rounded-2xl overflow-hidden banner-image flex items-center justify-center">
            {user.banner_url ? (
              <Image
                src={user.banner_url || ""}
                alt={displayName}
                width={3000}
                height={1000}
                className="w-full aspect-[3/1] "
              />
            ) : (
              <span className="w-16 block">
                <svg
                  width="100%"
                  viewBox="0 0 31 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.3388 27.8511C11.3388 26.5103 11.3388 25.84 11.3886 25.2748C11.942 18.993 16.9568 14.0124 23.2818 13.4629C23.8509 13.4134 24.5259 13.4134 25.8758 13.4134H29.2286M29.2286 13.4134C29.0102 12.6642 28.5675 11.8728 27.7775 10.4605L25.627 6.61599C24.6594 4.88622 24.1756 4.02134 23.4875 3.39155C22.8787 2.8344 22.1572 2.41276 21.3712 2.15483C20.4827 1.86328 19.4865 1.86328 17.4941 1.86328L13.9057 1.86328C11.9133 1.86328 10.9171 1.86328 10.0286 2.15483C9.24261 2.41276 8.5211 2.8344 7.91235 3.39156C7.22424 4.02134 6.74044 4.88623 5.77285 6.616L3.67306 10.3698C2.75689 12.0076 2.2988 12.8265 2.11921 13.6938C1.96026 14.4613 1.96026 15.253 2.11921 16.0206C2.2988 16.8878 2.75689 17.7067 3.67306 19.3446L5.77285 23.0984C6.74045 24.8281 7.22424 25.693 7.91235 26.3228C8.5211 26.8799 9.24261 27.3016 10.0286 27.5595C10.9171 27.8511 11.9133 27.8511 13.9057 27.8511H17.5787C19.5419 27.8511 20.5235 27.8511 21.4016 27.5668C22.1786 27.3154 22.8934 26.9041 23.4996 26.3598C24.1847 25.7446 24.673 24.8989 25.6496 23.2075L27.1365 20.6322L27.8542 19.2953C28.7247 17.6739 29.1599 16.8632 29.3261 16.0089C29.4731 15.2527 29.4664 14.4748 29.3062 13.7212C29.2844 13.6184 29.2586 13.5163 29.2286 13.4134ZM11.3388 11.9696C10.536 11.9696 9.88512 11.3232 9.88512 10.5259C9.88512 9.72851 10.536 9.08211 11.3388 9.08211C12.1417 9.08211 12.7925 9.72851 12.7925 10.5259C12.7925 11.3232 12.1417 11.9696 11.3388 11.9696Z"
                    stroke="#ADADAD"
                    strokeWidth="2.42043"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </div>
          <div className="w-full flex flex-row justify-between items-end -mt-20 pl-8 pr-6">
            <Image
              src={user.avatar_url || ""}
              alt={displayName}
              width={256}
              height={256}
              className="rounded-xl w-40 object-cover outline outline-[0.7rem] outline-white"
            />
            <div className="flex flex-row gap-4 buttons">
              <button className="px-6 pt-3 pb-2 text-[#FA5A59] border-[#FA5A59] rounded-xl border-[2px] font-semibold text-xl tracking-tight ">
                Hire
              </button>
              <button className="px-6 pt-3 pb-2 text-white bg-black rounded-xl font-semibold text-xl tracking-tight">
                Follow
              </button>
            </div>
          </div>
          <div className="flex flex-col pl-8 mt-4">
            <div className="flex flex-row gap-4">
              <h1 className="text-3xl font-semibold tracking-tighter">
                {displayName}
              </h1>
            </div>
            <div className="flex flex-row gap-4 text-lg text-[#ACACAC] mt-2">
              <div className="flex flex-row gap-2">
                <span className="w-5">
                  <svg
                    width="100%"
                    viewBox="0 0 14 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 6.88383C0 3.082 3.13401 0 7 0C10.866 0 14 3.082 14 6.88383C14 9.23616 12.8314 11.3925 11.5609 13.0556C10.2795 14.7328 8.81545 16.0111 8.05671 16.625C7.43875 17.125 6.56125 17.125 5.94329 16.625C5.18455 16.0111 3.72048 14.7328 2.43913 13.0556C1.16861 11.3925 0 9.23616 0 6.88383ZM6.99808 9.03503C8.2062 9.03503 9.18558 8.0719 9.18558 6.88383C9.18558 5.69576 8.2062 4.73263 6.99808 4.73263C5.78995 4.73263 4.81058 5.69576 4.81058 6.88383C4.81058 8.0719 5.78995 9.03503 6.99808 9.03503Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span>Los Angeles</span>
              </div>
              <Link
                href={user.website_url || ""}
                className="flex flex-row gap-2"
              >
                <span className="w-5">
                  <svg
                    width="100%"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.9497 6.70711L6.70711 10.9497M7.41421 3.17157L8.12132 2.46447C10.0739 0.511845 13.2398 0.511845 15.1924 2.46447C17.145 4.41709 17.145 7.58291 15.1924 9.53553L14.4853 10.2426M3.17157 7.41421L2.46447 8.12132C0.511845 10.0739 0.511845 13.2398 2.46447 15.1924C4.41709 17.145 7.58291 17.145 9.53553 15.1924L10.2426 14.4853"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>chromehearts.com</span>
              </Link>
            </div>
          </div>
        </div>
        {/* Content Section */}
        <div className="w-full mt-8">
          {/* Navigation & Social */}
          <div className="flex items-center justify-between mb-8 border-y-[1px] border-[#EAEAEA] pl-11 pr-9 py-4">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 border-[1px] border-[#f6f6f6] rounded-xl px-5 pt-2 pb-1 text-[#989898]">
                <span className="size-4 -mt-1">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 11 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.45426 0.757813V4.84526M8.45426 4.84526C7.48679 4.84526 6.7025 5.62955 6.70249 6.59703V7.18095C6.70249 8.14842 7.48679 8.93271 8.45426 8.93271C9.42173 8.93271 10.206 8.14842 10.206 7.18095V6.59703C10.206 5.62955 9.42173 4.84526 8.45426 4.84526ZM2.61505 8.34879L2.61505 11.2684M8.45426 10.6845V11.2684M2.61505 0.757812L2.61505 2.50958M2.61505 2.50958C1.64757 2.50958 0.863281 3.29387 0.863281 4.26134L0.863281 4.84526C0.863281 5.81273 1.64757 6.59703 2.61505 6.59703C3.58252 6.59703 4.36681 5.81273 4.36681 4.84526V4.26134C4.36681 3.29387 3.58252 2.50958 2.61505 2.50958Z"
                      stroke="currentColor"
                      strokeWidth="1.16784"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>Filter</span>
              </button>

              <button className="flex items-center gap-2 bg-[#f6f6f6] text-[#989898] px-5 pt-2 pb-1 rounded-lg">
                <span className="size-4 flex -mt-1">
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
              <button className="flex items-center gap-2 bg-[#f6f6f6] text-[#989898] px-5 pt-2 pb-1 rounded-lg">
                <span className="size-4 flex -mt-1">
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

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-11 pr-9">
            {/* Project Card 1 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-green-900">
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-light mb-1">
                      Meet our team of designers,
                    </h3>
                    <h4 className="text-lg font-light text-gray-300">
                      and researchers.
                    </h4>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            </div>

            {/* Project Card 2 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-video bg-gray-800 rounded-2xl overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-600">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,white_49%,white_51%,transparent_55%)]"></div>
                  </div>
                  <div className="absolute top-6 left-6 text-white">
                    <div className="text-sm text-gray-300 mb-2">Preview</div>
                    <h3 className="text-2xl font-light mb-1">Neue Mtl</h3>
                    <h4 className="text-lg font-light">(*Aa→e) v2.0</h4>
                    <div className="text-3xl font-bold mt-2">New!</div>
                  </div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="text-sm">Neue Mtl 2.0!</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );

  //   return (
  //     <div className="min-h-screen bg-white">
  //       {/* Hero Section */}
  //       <div className="relative h-[300px] bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-600 overflow-hidden">
  //         {/* Placeholder hero image */}
  //         <div className="absolute inset-0 bg-black/20">
  //           <Image
  //             src="/api/placeholder/1200/300"
  //             alt="Profile hero"
  //             fill
  //             className="object-cover opacity-80"
  //             priority
  //           />
  //         </div>

  //         {/* Overlay pattern */}
  //         <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

  //         {/* Profile Content */}
  //         <div className="absolute bottom-0 left-0 right-0 p-8">
  //           <div className="max-w-6xl mx-auto flex items-end gap-6">
  //             {/* Profile Picture */}
  //             <div className="relative">
  //               <div className="w-32 h-32 bg-black rounded-2xl flex items-center justify-center border-4 border-white shadow-xl">
  //                 {user.imageUrl ? (
  //                   <Image
  //                     src={user.imageUrl}
  //                     alt={displayName}
  //                     width={128}
  //                     height={128}
  //                     className="rounded-xl object-cover"
  //                   />
  //                 ) : (
  //                   <div className="text-white text-4xl font-bold">✕</div>
  //                 )}
  //               </div>
  //             </div>

  //             {/* User Info */}
  //             <div className="flex-1 text-white mb-4">
  //               <div className="flex items-center gap-3 mb-2">
  //                 <h1 className="text-3xl font-bold">{displayName}</h1>
  //                 <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
  //                   <svg
  //                     className="w-4 h-4 text-white"
  //                     fill="currentColor"
  //                     viewBox="0 0 20 20"
  //                   >
  //                     <path
  //                       fillRule="evenodd"
  //                       d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
  //                       clipRule="evenodd"
  //                     />
  //                   </svg>
  //                 </div>
  //               </div>

  //               <div className="flex items-center gap-6 text-white/80">
  //                 <div className="flex items-center gap-2">
  //                   <MapPin className="w-4 h-4" />
  //                   <span>Los Angeles</span>
  //                 </div>
  //                 <div className="flex items-center gap-2">
  //                   <ExternalLink className="w-4 h-4" />
  //                   <span>chromehearts.com</span>
  //                 </div>
  //               </div>
  //             </div>

  //             {/* Action Buttons */}
  //             <div className="flex gap-3 mb-4">
  //               {!isOwnProfile && (
  //                 <>
  //                   <button className="px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-white/20 transition-colors">
  //                     Hire
  //                   </button>
  //                   <button className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition-colors font-medium">
  //                     Follow
  //                   </button>
  //                 </>
  //               )}
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Content Section */}
  //       <div className="max-w-6xl mx-auto px-8 py-8">
  //         {/* Navigation & Social */}
  //         <div className="flex items-center justify-between mb-8">
  //           <div className="flex items-center gap-8">
  //             <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
  //               <Filter className="w-4 h-4" />
  //               <span>Filter</span>
  //             </button>
  //             <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
  //               <Award className="w-4 h-4" />
  //               <span>Awards</span>
  //             </button>
  //             <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
  //               <Star className="w-4 h-4" />
  //               <span>Honorable Mentions</span>
  //             </button>
  //           </div>

  //           {/* Social Links */}
  //           <div className="flex items-center gap-3">
  //             <a
  //               href="#"
  //               className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
  //             >
  //               <Linkedin className="w-5 h-5" />
  //             </a>
  //             <a
  //               href="#"
  //               className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
  //             >
  //               <Instagram className="w-5 h-5" />
  //             </a>
  //             <a
  //               href="#"
  //               className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
  //             >
  //               <Twitter className="w-5 h-5" />
  //             </a>
  //           </div>
  //         </div>

  //         {/* Projects Grid */}
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //           {/* Project Card 1 */}
  //           <div className="group cursor-pointer">
  //             <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-4">
  //               <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-green-900">
  //                 <div className="absolute bottom-6 left-6 text-white">
  //                   <div className="flex items-center gap-2 mb-2">
  //                     <div className="w-3 h-3 bg-green-400 rounded-full"></div>
  //                     <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
  //                   </div>
  //                   <h3 className="text-xl font-light mb-1">
  //                     Meet our team of designers,
  //                   </h3>
  //                   <h4 className="text-lg font-light text-gray-300">
  //                     and researchers.
  //                   </h4>
  //                 </div>
  //               </div>
  //               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
  //             </div>
  //           </div>

  //           {/* Project Card 2 */}
  //           <div className="group cursor-pointer">
  //             <div className="relative aspect-video bg-gray-800 rounded-2xl overflow-hidden mb-4">
  //               <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-600">
  //                 <div className="absolute inset-0 opacity-20">
  //                   <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,white_49%,white_51%,transparent_55%)]"></div>
  //                 </div>
  //                 <div className="absolute top-6 left-6 text-white">
  //                   <div className="text-sm text-gray-300 mb-2">Preview</div>
  //                   <h3 className="text-2xl font-light mb-1">Neue Mtl</h3>
  //                   <h4 className="text-lg font-light">(*Aa→e) v2.0</h4>
  //                   <div className="text-3xl font-bold mt-2">New!</div>
  //                 </div>
  //                 <div className="absolute bottom-6 left-6 text-white">
  //                   <div className="text-sm">Neue Mtl 2.0!</div>
  //                 </div>
  //               </div>
  //               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
  //             </div>
  //           </div>
  //         </div>

  //         {/* Stats or additional info */}
  //         <div className="mt-12 text-center text-gray-500">
  //           <p>Showcasing creative work and design projects</p>
  //         </div>
  //       </div>
  //     </div>
  //   );
}
