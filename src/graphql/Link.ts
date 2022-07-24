import { objectType, extendType, nonNull, stringArg, idArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
  name: "Link",
  definition(t) { 
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
    t.field("postedBy", {   
      type: "User",
      resolve(parent, args, context) {  
          return context.prisma.link
              .findUnique({ where: { id: parent.id } })
              .postedBy();
      },
    });
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
        const { description, url } = args;
        const { userId } = ctx;

        if (!userId) {
          throw new Error("You must be logged in to post a link");
        }

        const newLink = ctx.prisma.link.create({
          data: {
            description,
            url,
            postedBy: { connect: { id: userId } },
          },
        });
        return newLink;
      },
    });
  },
});