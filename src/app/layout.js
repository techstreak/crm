// src/app/layout.js
export const metadata = {
    title: 'My CRM',
    description: 'CRM app using Next.js and PostgreSQL',
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }
  