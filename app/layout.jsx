
import "@/app/globals.css";

export const metadata = {
  title: "AIOPS Monitoring — AI-Precision Infrastructure Intelligence",
  description:
    "Intelligent infrastructure monitoring powered by Isolation Forests and LSTM forecasting. Observe the invisible.",

  openGraph: {
    title: "AIOPS Monitoring",
    description: "High-Precision AIOps for the Modern Cloud",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}