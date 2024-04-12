import { Auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/button";

const CTAButton = async ({}) => {
  const user = await Auth();
  return (
    <Link
      href={user ? "/dashboard" : "/sign-in"}
      className={cn(buttonVariants({ size: "lg" }), "bg-orange-600 group")}
    >
      Upload Document
      <Icons.RightArrow className=" group-hover:translate-x-2 transition-all duration-300 w-4 h-4 ml-2" />
    </Link>
  );
};

export default CTAButton;
