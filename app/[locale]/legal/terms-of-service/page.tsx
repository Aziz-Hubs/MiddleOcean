import { useTranslations } from "next-intl";

export default function TermsOfServicePage() {
	const t = useTranslations("Navigation");
	return (
		<div className="container mx-auto py-20 px-4">
			<h1 className="text-4xl font-bold mb-8">{t("terms")}</h1>
			<p className="text-muted-foreground">This page is under construction.</p>
		</div>
	);
}
