import { cn } from "@/lib/utils";
import React from "react";
import { BackButton } from "../button/button";

const SectionHeading = ({
  className,
  ...props
}: React.ComponentProps<"h2">) => {
  return (
    <h2
      className={cn("text-xl font-semibold flex items-center gap-2", className)}
      {...props}
    />
  );
};

const SectionHeadingIcon = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "h-8 aspect-square [&>svg]:size-5 [&>svg]:fill-secondary/15 flex justify-center items-center bg-secondary-foreground text-secondary rounded-full",
        className
      )}
      {...props}
    />
  );
};

const SectionSubTitle = ({
  className,
  ...props
}: React.ComponentProps<"p">) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
};

const SectionHeadingWithBackButton = ({
  title,
  className,
  subtitle,
  ...props
}: React.ComponentProps<"div"> & { subtitle?: string }) => {
  return (
    <div className={cn("flex gap-2", className)} {...props}>
      <BackButton />
      <div className="flex flex-col gap-0">
        <SectionHeading>{title}</SectionHeading>
        <SectionSubTitle>{subtitle}</SectionSubTitle>
      </div>
    </div>
  );
};

export {
  SectionHeading,
  SectionSubTitle,
  SectionHeadingIcon,
  SectionHeadingWithBackButton,
};
