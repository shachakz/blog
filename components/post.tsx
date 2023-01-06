import { Component, useState } from "react";
import Image from "next/image";
import deved from "../public/jonathan.jpg";
import Shit from "./shit";

export default function Post() {
  const [a, b] = useState(false);

  return (
    <div>
      <Shit color={a ? "text-purple-600" : "text-blue-600"} />
      <div className="flex justify-center mt-5">
        <button
          className="rounded-md px-2 py-1 outline outline-1 outline-black shadow-inner shadow-slate-500"
          onClick={() => b(!a)}
        >
          Outer component
        </button>
      </div>
    </div>
  );
}
