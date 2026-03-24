"use client";

import dynamic from "next/dynamic";

const DynamicWebGLShader = dynamic(
  () => import("@/components/ui/web-gl-shader").then((mod) => mod.WebGLShader),
  {
    ssr: false,
  }
);

export function WebGLShaderWrapper() {
  return <DynamicWebGLShader />;
}
