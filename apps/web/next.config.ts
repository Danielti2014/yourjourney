import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Empacota o app com apenas o necessario para rodar, o que deixa a imagem
  // de producao pequena. E o estagio "production" do Dockerfile que usa isso.
  output: 'standalone',
};

export default nextConfig;
