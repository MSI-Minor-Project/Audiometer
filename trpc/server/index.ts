import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { prisma } from '../../prisma/prisma';
import { TRPCError } from '@trpc/server';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

const appRouter = router({
    createUser: publicProcedure.input(z.object({
        name: z.string(),
        uid: z.string(),
        email: z.string().email(),
    })).mutation(async ({ input }) => {
        try {
            const user = await prisma.user.create({
                data: {
                    name: input.name,
                    uid: input.uid,
                    email: input.email,
                },
            });
            return user;
        } catch (error) {

            if (error instanceof TRPCError) {
                return error.message;
            }

            if (error instanceof PrismaClientValidationError) {
                return error.message;
            }

            if (error instanceof Error) {
                return error.message;
            }
        }
    })
});

const server = createHTTPServer({
    router: appRouter,
});

server.listen(3000);
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
