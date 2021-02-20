config = {
  httpServer: true,
  httpIp: process.env.IP || '0.0.0.0',
  httpPort: Number(process.env.PORT) || 3000,

  apiPrefix: '/api/latest',

  useCors: true,
  whitelist: [],

  logging: {
    level: 'info',
  },

  shortidChars = process.env.SHORTID_CHARS || '-23456789ABCDEFGHJKLMNPQRSTVWXYZ',
  shortidAttempts = 50,
  shortidCasesensitive = process.env.SHORTID_CASESENSITIVE || false,
  shortidRemovewords = 'anal,anus,arse,ass,ballsack,balls,bastard,bitch,biatch,bloody,blowjob,blowjob,' +
    'bollock,bollok,boner,boob,bugger,bum,butt,buttplug,clitoris,cock,coon,crap,cunt,damn,dick,dildo,dyke,' +
    'fag,feck,fellate,fellatio,felching,fuck,fudgepacker,fudgepacker,flange,goddamn,god,hell,homo,jerk,jizz,' +
    'knobend,labia,lmao,lmfao,muff,nigger,nigga,omg,penis,piss,poop,prick,pube,pussy,queer,scrotum,sex,shit,' +
    'slut,smegma,spunk,tit,tosser,turd,twat,vagina,wank,whore,wtf',

  configFileThread: [
    './auth.js',
    './db.js',
    './rbac.js',
    './squareup.js',
  ],
};
