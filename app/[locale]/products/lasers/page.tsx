import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Navigation");
  return (
    <div className="container mx-auto py-24 px-6 text-center">
      <h1 className="text-4xl font-black uppercase tracking-tighter">
        {t("products_title")} - Lasers
      </h1>
      <p className="mt-4 text-muted-foreground">Scaffolded lasers category page.</p>
    </div>
  );
}
