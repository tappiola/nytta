import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import React from "react";
import Link from "next/link";

const User = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
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
      <Link href="/api/auth/logout">
        <span className="pi pi-sign-out"></span>
      </Link>
    </>
  );
};

export default User;
