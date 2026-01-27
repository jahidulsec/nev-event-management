"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

const PasswordInput = ({ ...props }: React.ComponentProps<"input">) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <p className="relative">
      <Input
        type={!showPassword ? "password" : "text"}
        name="password"
        id="password"
        {...props}
      />
      <button
        type="button"
        className="eye absolute top-[50%] -translate-y-[50%] right-3 cursor-pointer"
        onClick={() => {
          setShowPassword(!showPassword);
        }}
      >
        {showPassword ? (
          <Eye className="size-4" />
        ) : (
          <EyeOff className="size-4" />
        )}
      </button>
    </p>
  );
};

export { PasswordInput };
