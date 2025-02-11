import Navbar from "./components/navbar";
import { ToastBox } from "./components/toast";
import { AuthProvider } from "./utils/context/authContext";
import { Poppins } from "next/font/google";

export const poppins = Poppins({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "Mero Kotha",
  description: "A rent application for students and young people!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {/* <SnackbarProvider> */}
      <html lang="en">
        <body style={{ margin: 0, padding: 0 }}>
          <Navbar />
          {children}
          <ToastBox />
        </body>
      </html>
      {/* </SnackbarProvider> */}
    </AuthProvider>
  );
}
