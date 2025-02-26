import React, { forwardRef } from "react";
import { Input as InputComponent, InputProps } from "@heroui/react";

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <InputComponent
      className="w-64"
      classNames={{
        inputWrapper: [
          "bg-white pl-5 border-[1px] border-[#E2E2E2] rounded-2xl shadow",
        ],
        input: ["font-medium"],
      }}
      {...props}
      ref={ref}
    />
  );
});

Input.displayName = "Input";

export default Input;
