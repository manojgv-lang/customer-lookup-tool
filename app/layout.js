import "./globals.css";

export const metadata = {
  title: "Customer Lookup Tool",
  description: "Operations Customer Lookup Tool"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
