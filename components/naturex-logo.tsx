export function NatureXLogo({
  size = "default",
}: {
  size?: "sm" | "default" | "lg";
}) {
  const textSizes = {
    sm: "text-lg",
    default: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`${textSizes[size]} font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent`}
      >
        NATURE
      </div>
      <div
        className={`${textSizes[size]} font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent`}
      >
        X
      </div>
    </div>
  );
}
