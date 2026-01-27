import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="my-3">
      <p className="text-center text-xs md:text-sm">
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
    </footer>
  );
};

export { Footer };
