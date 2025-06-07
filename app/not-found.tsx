export default function NotFound() {
  return (
    <div className="w-screen h-svh flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold flex flex-col items-center">
          <span>This page does not exist</span>
          <span className="text-[20vw] leading-none">404</span>
        </h1>
      </div>
    </div>
  );
}
