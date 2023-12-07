import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/index';
//     👆 **type-only** import

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.

import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();
// export const trpc = createTRPCProxyClient<AppRouter>({
//     links: [
//         httpBatchLink({
//             url: 'http://192.168.174.65:3000',
//         }),
//     ],
// });