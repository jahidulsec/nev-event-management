import { cn } from "@/lib/utils";
import React from "react";

const Section = ({ className, ...props }: React.ComponentProps<"section">) => {
  return (
    <section className={cn("px-6 container mx-auto", className)} {...props} />
  );
};

const SectionHeader = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "flex items-center gap-5 justify-between flex-wrap",
        className
      )}
      {...props}
    />
  );
};

const SectionFilter = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "flex items-center gap-5 justify-between flex-wrap my-6 flex-col sm:flex-row",
        className
      )}
      {...props}
    />
  );
};

const SectionActions = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 flex-col sm:flex-wrap w-full sm:w-fit sm:flex-row [&>button]:w-full sm:[&>button]:w-fit",
        className
      )}
      {...props}
    />
  );
};

const SectionContent = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div className={cn("flex flex-col gap-3 mt-6", className)} {...props} />
  );
};

export {
  Section,
  SectionHeader,
  SectionActions,
  SectionContent,
  SectionFilter,
};
