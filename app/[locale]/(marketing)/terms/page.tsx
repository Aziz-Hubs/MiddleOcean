import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Footer");
  return (
    <div className="container mx-auto py-24 px-6 text-center">
      <h1 className="text-4xl font-black uppercase tracking-tighter">
        {t("links.terms")}
      </h1>
      <p className="mt-4 text-muted-foreground">Scaffolded terms of service page.</p>
    </div>
  );
}
