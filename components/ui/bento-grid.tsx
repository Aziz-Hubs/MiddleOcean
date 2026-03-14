import { ReactNode } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[18rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className: string;
  background: ReactNode;
  Icon: any;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col overflow-hidden rounded-none m-0 p-0",
      "cursor-pointer",
      className,
    )}
  >
    {background}
    <div className="pointer-events-none z-30 flex absolute top-4 start-4 transform-gpu flex-col gap-1 transition-all duration-300 group-hover:-translate-y-1">
      <Icon className="h-8 w-8 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-90 dark:text-neutral-300" />
      <h3 className="text-xl font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-tighter">
        {name}
      </h3>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 z-30 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <p className="max-w-lg text-sm text-neutral-400 font-medium">
        {description}
      </p>
    </div>
    <div className="pointer-events-none absolute inset-0 z-20 transform-gpu transition-all duration-300 group-hover:bg-black/20" />
  </div>
);
