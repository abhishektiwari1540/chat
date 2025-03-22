import React from "react";

export default function Input({ value, onChange, placeholder, className, ...props }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none ${className}`}
      {...props}
    />
  );
}
