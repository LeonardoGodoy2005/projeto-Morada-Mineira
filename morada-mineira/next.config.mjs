/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permitir acesso via IP local na rede (ex: celular, outro PC)
  // Isso evita erros de CORS no WebSocket do HMR quando acessado via IP
  allowedDevOrigins: [
    "192.168.0.123",
    // Adicione outros IPs conforme necessário
  ],
};

export default nextConfig;
