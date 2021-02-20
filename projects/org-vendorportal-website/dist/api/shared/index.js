config = {
  httpServer: true,
  httpIp: process.env.IP || '0.0.0.0',
  httpPort: Number(process.env.PORT) || 3020,

  apiPrefix: '/api/latest',

  useCors: true,
  whitelist: [],

  // https://www.fastify.io/docs/latest/Logging/
  logger: {
    level: 'silent', // trace > debug > info > warn > error > fatal > silent
    prettyPrint: true, // https://getpino.io/#/docs/pretty
    redact: ['pass', 'password', 'authorization'] // https://getpino.io/#/docs/redaction
  },

  shortidAttempts: 50,
  shortidCasesensitive: false,
  shortidChars: '23456789ABCDEFGHJKLMNPQRSTUVWXYZ',
  shortidRemovewords: 'anal,anus,arse,ass,ballsack,balls,bastard,bitch,biatch,bloody,blowjob,blowjob,' +
    'bollock,bollok,boner,boob,bugger,bum,butt,buttplug,clitoris,cock,coon,crap,cunt,damn,dick,dildo,dyke,' +
    'fag,feck,fellate,fellatio,felching,fuck,fudgepacker,fudgepacker,flange,goddamn,god,hell,homo,jerk,jizz,' +
    'knobend,labia,lmao,lmfao,muff,nigger,nigga,omg,penis,piss,poop,prick,pube,pussy,queer,scrotum,sex,shit,' +
    'slut,smegma,spunk,tit,tosser,turd,twat,vagina,wank,whore,wtf'
};
