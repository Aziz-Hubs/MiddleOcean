export const metadata = {
  title: "Sanity Studio",
  description: "Content Management System",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
