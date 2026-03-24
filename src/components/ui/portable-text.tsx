import { PortableText as PortableTextComponent } from "next-sanity";
import { cn } from "@/lib/utils";

const components = {
  block: {
    h2: ({ children }: any) => (
      <h2 className="mt-10 mb-4 text-2xl font-bold tracking-tight text-foreground first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="mt-8 mb-4 text-xl font-semibold tracking-tight text-foreground">
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="ps-6 mt-6 italic border-s-2 border-primary">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="ms-6 list-disc [&>li]:mt-2">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="ms-6 list-decimal [&>li]:mt-2">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold whitespace-nowrap">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
      return (
        <a
          href={value.href}
          rel={rel}
          className="font-medium underline underline-offset-4 decoration-primary/50 hover:decoration-primary transition-colors"
        >
          {children}
        </a>
      );
    },
  },
};

interface PortableTextProps {
  value: any;
  className?: string;
}

export function PortableText({ value, className }: PortableTextProps) {
  return (
    <div className={cn("max-w-none text-muted-foreground", className)}>
      <PortableTextComponent value={value} components={components} />
    </div>
  );
}
