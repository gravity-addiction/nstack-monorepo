import { randomBytes } from 'crypto';

export const uuidv4 = () => ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,
    // eslint-disable-next-line no-bitwise
    (a: number) => ((a ^ randomBytes(1)[0] * 16 >> a / 4).toString(16))[0]
);

