import Footer from "@/components/ui/shared/Footer";
import Header from "@/components/ui/shared/Header";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen pt-0 m-0">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
  );
}
