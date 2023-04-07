export default function LoadingLine({ className }: { className?: string }) {
  return (
    <div className={`loading_line_wrapper ${className}`}>
      <div className="loading_line">
        <div className="loading_line_inner loading_line_inner--1"></div>
        <div className="loading_line_inner loading_line_inner--2"></div>
      </div>
    </div>
  );
}
