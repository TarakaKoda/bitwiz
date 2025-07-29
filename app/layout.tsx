import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut
} from "@clerk/nextjs";
import React from "react";
import NavBar from "./components/nav-bar";
import "./globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <NavBar />
          </SignedIn>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
