"use client";

import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/3d-testimonails";

interface Testimonial {
  name: string;
  username: string;
  body: string;
  country: string;
  img: string;
  key: string;
}

const TestimonialCard = ({
  img,
  name,
  username,
  body,
  country,
}: Omit<Testimonial, "key">) => {
  return (
    <Card className="w-80 h-[220px] border-white/10 bg-white/5 backdrop-blur-md flex flex-col">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex flex-row items-center gap-4 shrink-0">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src={img} alt={name} className="object-cover" />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white truncate">{name}</span>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{country}</span>
            </div>
            <p className="text-xs font-medium text-primary/80 truncate">{username}</p>
          </div>
        </div>
        <blockquote className="mt-4 text-sm leading-relaxed text-gray-300 italic flex-grow overflow-hidden line-clamp-4">
          "{body}"
        </blockquote>
      </CardContent>
    </Card>
  );
};

export function TestimonialsSection() {
  const t = useTranslations("Testimonials");


  const unsplashIds = [
    "i96BipVp0G8", "7v_2aL_M_Ac", "67nS5S538g4", "9V-YmN75mRA", "y_P5WkjK9V0",
    "fI6v1u2_F9k", "XhMSz5I1f8Z", "p_7YvYF6_Y8", "v_P5WkjK9V0", "rDEOVtE7vHs",
    "QX93uE5p2T4", "0u_P6pX7v_M", "v_P5WkjK9V1", "fI6v1u2_F9l", "XhMSz5I1f9Z",
    "p_7YvYF6_Z8", "v_P5WkjK9V2", "rDEOVtE7vHt", "QX93uE5p2T5", "0u_P6pX7v_N"
  ];

  const testimonials: Testimonial[] = Array.from({ length: 20 }, (_, i) => {
    const itemKey = `item${i + 1}`;
    return {
      name: t(`items.${itemKey}.name`),
      username: t(`items.${itemKey}.username`),
      body: t(`items.${itemKey}.body`),
      country: t(`items.${itemKey}.country`),
      img: `https://images.unsplash.com/photo-${unsplashIds[i]}?q=80&w=200&auto=format&fit=crop`,
      key: itemKey,
    };
  });

  const columns = [
    testimonials.slice(0, 5),
    testimonials.slice(5, 10),
    testimonials.slice(10, 15),
    testimonials.slice(15, 20),
  ];

  return (
    <section className="relative w-full overflow-hidden bg-black py-24">
      <div className="absolute top-0 start-0 h-full w-full opacity-30 pointer-events-none">
        <div className="absolute -top-24 -start-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-pink-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -end-24 h-96 w-96 rounded-full bg-yellow-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold tracking-wide text-primary uppercase drop-shadow-sm">
            {t("title")}
          </h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t("subtitle")}
          </p>
        </div>

        <div 
          className="relative flex h-[700px] w-full items-center justify-center overflow-hidden [perspective:1500px]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="flex h-full w-fit gap-8 transition-transform duration-500 [transform:rotateX(15deg)_rotateY(-15deg)]">
            <Marquee vertical pauseOnHover repeat={4} className="[--duration:50s] [--gap:1.5rem]">
              {columns[0].map(({ key, ...review }) => (
                <TestimonialCard key={key} {...review} />
              ))}
            </Marquee>
            
            <Marquee vertical pauseOnHover reverse repeat={4} className="[--duration:40s] [--gap:1.5rem]">
              {columns[1].map(({ key, ...review }) => (
                <TestimonialCard key={key} {...review} />
              ))}
            </Marquee>

            <Marquee vertical pauseOnHover repeat={4} className="[--duration:60s] [--gap:1.5rem]">
              {columns[2].map(({ key, ...review }) => (
                <TestimonialCard key={key} {...review} />
              ))}
            </Marquee>

            <Marquee vertical pauseOnHover reverse repeat={4} className="[--duration:45s] [--gap:1.5rem]">
              {columns[3].map(({ key, ...review }) => (
                <TestimonialCard key={key} {...review} />
              ))}
            </Marquee>
          </div>
          
          <div className="pointer-events-none absolute inset-y-0 start-0 w-1/3 bg-gradient-to-r from-black via-black/60 to-transparent z-30" />
          <div className="pointer-events-none absolute inset-y-0 end-0 w-1/3 bg-gradient-to-l from-black via-black/60 to-transparent z-30" />
        </div>
      </div>
    </section>
  );
}
