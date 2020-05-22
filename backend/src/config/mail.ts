interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'geraldo@meudominio.com.br',
      name: 'Geraldo do GoBarber',
    },
  },
} as IMailConfig;
