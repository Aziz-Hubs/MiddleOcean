import Image from "next/image";
import type React from "react";

export const LogoIcon = (props: React.ComponentProps<"svg">) => (
	<Image
		src="/brand/logo.svg"
		alt="Middle Ocean Logo Icon"
		width={24}
		height={24}
		className={props.className}
		priority
	/>
);

export const Logo = (props: React.ComponentProps<"svg">) => (
	<Image
		src="/brand/logo.svg"
		alt="Middle Ocean Printing Logo"
		width={180}
		height={98}
		className={props.className}
		priority
	/>
);
