export default function AuthPagesWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="w-full h-fit lg:h-[65svh] flex flex-row items-center justify-center text-dark-green">
      <div className="w-full h-full flex flex-col items-center justify-center lg:flex-row p-4">
        {children}
      </div>
    </main>
  )
}
