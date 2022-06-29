const withPWA = require('next-pwa')

module.exports = {
  basePath: '',
  images: {
    domains: ['www.gravatar.com','static.actu.fr','images.lanouvellerepublique.fr','i2.wp.com','www.lebarasushi.com','www.lamontagne.fr','institutcoop.hec.ca'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  pwa: {
    dest: 'public'
  }
};