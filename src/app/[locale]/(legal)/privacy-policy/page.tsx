import { sanityClient } from "@/sanity/client";
import { siteSettingsQuery } from "@/sanity/queries";
import { ZeroCollectionHero, CommunicationGrid, TechnicalDataCard } from "@/components/legal/PrivacyComponents";
import ContactUs1 from "@/components/contact-us-1";

interface PageProps {
	params: Promise<{ locale: string }>;
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
	const { locale } = await params;
	const siteSettings = await sanityClient.fetch(siteSettingsQuery);

	return (
		<div className="relative min-h-screen pt-32 pb-20 overflow-clip">
			{/* Background blobs for premium look */}
			<div className="absolute top-40 right-0 -z-10 size-96 bg-primary/5 blur-[120px] rounded-full" />
			<div className="absolute bottom-40 left-0 -z-10 size-96 bg-cyan-500/5 blur-[120px] rounded-full" />

			<div className="container px-4 md:px-6 mx-auto">
				<div className="max-w-4xl mx-auto">
					{/* Hero Section */}
					<ZeroCollectionHero />

					{/* Layout for reading */}
					<section className="space-y-12 mb-20">
						<CommunicationGrid />
						
						<TechnicalDataCard />
					</section>

				</div>

				{/* Actionable Footer CTA - Out side the narrow container for full impact */}
				<div className="mt-20 border-t border-border/50 pt-20">
					<ContactUs1 settings={siteSettings} />
				</div>
			</div>
		</div>
	);
}
