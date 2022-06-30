const withPWA = require('next-pwa');

module.exports = {
  basePath: '',
  images: {
    domains: [
      'localhost',
      'www.gravatar.com',
      'static.actu.fr',
      'images.lanouvellerepublique.fr',
      'i2.wp.com',
      'www.lebarasushi.com',
      'www.lamontagne.fr',
      'institutcoop.hec.ca',
      'baptistemiq-ceseat-xgr777qwcvr4j-3100.githubpreview.dev',
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  pwa: {
    dest: 'public',
  },
};
