import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo.svg";

const Logo = () => {
  return (
    <Link href="/">
      <Image src={logo} alt="Logo" width={100} height={100} />
    </Link>
  );
};

export default Logo;
