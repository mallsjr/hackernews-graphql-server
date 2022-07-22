import { objectType, extendType, nonNull, stringArg, idArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
  name: "Link",
  definition(t) { 
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
  }
});


export const LinkQuery = extendType({
  type: "Query",
  definition(t) { 
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      resolve(parent, args, ctx, info) { 
        return ctx.prisma.link.findMany();
      }
    });
  }
});

export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) { 
    t.nonNull.field("post", {
      type: "Link",
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      resolve(parent, args, ctx) {
        const newLink = ctx.prisma.link.create({
          data: {
            description: args.description,
            url: args.url,
          },
        });
        return newLink;
      },
    });
  },
});