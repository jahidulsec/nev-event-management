import Link from "next/link";
import { LogoFull } from "../logo/company";
import { cn } from "@/lib/utils";

const Footer = ({ className }: { className?: string }) => {
  return (
    <footer className={cn("p-6 bg-slate-950 text-background mt-10", className)}>
      <div className="container mx-auto flex justify-between items-center flex-wrap text-sm gap-y-6 gap-x-3">
        <LogoFull width={200} color={{ primary: "#fff" }} />
        <div className="">
          <p>
            © 2026{" "}
            <Link
              href={"https://www.nevian.com.bd/"}
              target="_blank"
              className="hover:underline hover:text-primary"
            >
              Nevian Lifescience PLC
            </Link>
            . All rights reserved
          </p>
          <p>
            Designed & Developed By{" "}
            <em className="not-italic font-bold ">
              <Link
                href={"https://impalaintech.com"}
                target="_blank"
                className="hover:underline hover:text-primary"
              >
                Impala Intech LTD.
              </Link>
            </em>
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
