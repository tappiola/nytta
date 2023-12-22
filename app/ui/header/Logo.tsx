import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo.svg";
import logoImg from "@/public/images/logoImg.svg";

const Logo = () => {
  return (
    <Link href="/" className="flex gap-4 items-center ms-4">
      <Image src={logoImg} alt="Logo Img" height={35} />
      <Image src={logo} alt="Logo" height={28} />
    </Link>
  );
};

export default Logo;
