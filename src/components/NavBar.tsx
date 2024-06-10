"use client";

import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Avatar,
  NavbarMenu,
  NavbarMenuToggle,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import Image from "next/image";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, SunMoon } from "lucide-react";
import { cn } from "@src/lib/utils";
import DialogForm from "./DialogForm";

export default function NavBar() {
  const [providers, setProviders] = useState<any | null>();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [showDialog, setShowDialog] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  useEffect(() => {
    const getProvider = async () => {
      try {
        const res = await getProviders();
        setProviders(res);
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    };
    getProvider();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };
  const closeDialog = () => setShowDialog(!showDialog);
    const openDialog = () => setShowDialog(true);

  const renderAuthButtons = () => {
    if (session) {
      return (
        <>
          <button
            className={cn(
              "mr-2 py-2 text-xs font-semibold transition duration-300 ease-in-out",
              theme === "light"
                ? "text-black hover:bg-opacity-80"
                : "text-white hover:bg-opacity-80",
            )}
            onClick={handleSignOut}
          >
            Sign Out
          </button>{" "}
          <button
            onClick={openDialog}
            className={cn(
              "py-2 text-xs font-semibold transition duration-300 ease-in-out",
              theme === "light"
                ? "text-black hover:bg-opacity-80"
                : "text-white hover:bg-opacity-80",
            )}
          >
            Create Post
          </button>
        </>
      );
    } else {
      return (
        <button
          className={cn(
            "py-2 text-xs font-semibold transition duration-300 ease-in-out",
            theme === "light"
              ? " text-black hover:bg-opacity-80"
              : " text-white hover:bg-opacity-80",
          )}
          onClick={() => signIn()}
        >
          Sign In
        </button>
      );
    }
  };

  return (
    <Navbar shouldHideOnScroll onMenuOpenChange={setIsMenuOpen}>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      <NavbarBrand className="items-center gap-2 sm:flex">
        {" "}
        <Image
          src="/assets/images/logo.svg"
          alt="logo"
          width={30}
          height={30}
          className="hidden rounded-full object-cover sm:flex"
          onClick={() => router.push("/")}
        />
        <p
          className={cn(
            "font-bold",
            theme === "light" ? "text-black" : "text-white",
          )}
        >
          Build And Grow
        </p>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem className="items-center">
          <Dropdown className="dark:bg-black bg-white rounded-3xl text-black dark:text-white">
            <DropdownTrigger>
              <SunMoon />
            </DropdownTrigger>
            <DropdownMenu aria-label="Theme Options">
              <DropdownItem key="dark" onClick={() => setTheme("dark")}>
                Dark
              </DropdownItem>
              <DropdownItem key="light" onClick={() => setTheme("light")}>
                Light
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
        <NavbarItem className="hidden sm:flex">
          {renderAuthButtons()}
        </NavbarItem>
        <NavbarItem>
          {session?.user?.image && (
            <Avatar
              src={session.user?.image || ""}
              color="primary"
              onClick={() => router.push("/profile")}
              size="sm"
              alt="user_image"
            />
          )}
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>{renderAuthButtons()}</NavbarMenu>
      <DialogForm open={showDialog} onClose={closeDialog} onSubmit={() => {}} />
    </Navbar>
  );
}
