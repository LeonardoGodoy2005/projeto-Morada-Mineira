import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { COMPANY } from "@/config/company.config";

export const metadata = {
  title: `${COMPANY.name} — ${COMPANY.description}`,
  description: COMPANY.slogan,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>
        <AuthProvider>
          <TaskProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </TaskProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
