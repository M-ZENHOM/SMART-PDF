"use client";
import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function NewsLetter() {
  return (
    <form className="mt-6" onSubmit={(e) => e.preventDefault()}>
      <div className="relative max-w-lg">
        <label className="sr-only" htmlFor="email">
          Email
        </label>

        <Input
          className="w-full rounded-full border-gray-200 bg-gray-100 p-6 pe-32 text-sm font-medium"
          id="email"
          type="email"
          placeholder="zenhom@gmail.com"
        />

        <Button className="absolute end-1 top-1/2 -translate-y-1/2 rounded-full px-5 py-3 ">
          Subscribe
        </Button>
      </div>
    </form>
  );
}
