import CTAButton from "@/components/CTAButton";
import { Icons } from "@/components/Icons";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Features from "@/components/sections/Features";
import Steps from "@/components/sections/Steps";
import Image from "next/image";

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className="pt-40 space-y-6">
        <div className="group flex items-center justify-center w-full max-w-[15rem] mx-auto bg-primary/90 py-2 rounded-full text-primary-foreground relative overflow-hidden hover:pr-6 transition-all duration-300">
          Start your conversation
          <Icons.Msg className="w-6 h-6 translate-y-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 absolute -bottom-1 right-1 " />
        </div>

        <div className="space-y-3 text-center text-balance">
          <h1 className="text-5xl md:text-7xl font-bold text-primary/90 bg-opacity-50">
            SMART PDF <br /> your fresh{" "}
            <span className="text-orange-600">confidant.</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            It&apos;s not just reading anymore, it&apos;s a conversation
          </p>
          <CTAButton />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mt-16 flow-root sm:mt-24">
          <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <Image
              src="/dashboard-preview.jpg"
              alt="product preview"
              width={1364}
              height={866}
              quality={100}
              className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
            />
          </div>
        </div>
      </div>
      <Steps />
      <Image
        src="/UploadPDF.PNG"
        alt="Upload Preview"
        width={1364}
        height={866}
        quality={100}
        className="rounded-md bg-white/5 p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
      />
      <Features />
    </MaxWidthWrapper>
  );
}
