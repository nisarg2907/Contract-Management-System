import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NextTopLoader from "nextjs-toploader";
import { SidebarProvider } from '@/components/ui/sidebar';

export const metadata = {
  title: "Contract management",
  description: "Contract Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader showSpinner={false} color="#29d" crawlSpeed={200} />
        <SidebarProvider>
          <div className="flex h-full">
            <main
              className={`flex-1 h-full overflow-auto transition-all duration-300`}
            >
              {children}
              <ToastContainer position="bottom-right" autoClose={3000} />
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
