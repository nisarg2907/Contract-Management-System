import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NextTopLoader from "nextjs-toploader";

export const metadata = {
  title: "LNL",
  description: "Look And Learn",
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

        <main
          className={`flex-1 h-full overflow-auto transition-all duration-300`}
        >
          {children}
          <ToastContainer position="bottom-right" autoClose={3000} />
        </main>
      </body>
    </html>
  );
}
