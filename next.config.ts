import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Solo para `next dev`: permite abrir el servidor local desde otros equipos
  // de la red (ej. el celular en 192.168.18.51:3000). Sin esto, Next bloquea
  // sus scripts para orígenes que no son localhost y la página no responde.
  allowedDevOrigins: ["192.168.18.51", "192.168.*.*"],
};

export default nextConfig;
