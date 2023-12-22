"use client";
import Image from "next/image";
import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "primereact/button";

const UserActions = () => {
  const { user } = useUser();

  return user ? (
    <>
      <span className="user-info">
        <Image
          src={user.picture!}
          alt="Profile"
          className="rounded-full"
          width="45"
          height="45"
        />
      </span>
      <a href="/api/auth/logout" className="text-white">
        <span className="pi pi-sign-out"></span>
      </a>
    </>
  ) : (
    <a href="/api/auth/login" className="ms-auto me-0">
      <Button label="Login" />
    </a>
  );
};

export default UserActions;
