import { ForbiddenError, ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import customer from "src/db/models/customer";
import project from "src/db/models/project";
import service from "src/db/models/service";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    project: async (_, { where }, ctx, info) => {
      return await project.get(where.id, ctx, info);
    },
    projects: async (_, args, ctx, info) => {
      return await ctx.db.query.projectsConnection(
        {
          where: {
            ...args.where,
            company: {
              id: get(ctx, "auth.companyId"),
            },
            isDeleted: false,
          },
          orderBy: args.orderBy,
          skip: args.skip,
          after: args.after,
          before: args.before,
          first: args.first,
          last: args.last,
        },
        info,
      );
    },
  },
  Mutation: {
    createProject: async (_, { data }, ctx, info) => {
      // check if user want to connect to already existing customer
      if (get(data, "customer.connect.id")) {
        // check whether custom belongs to company(from header) or not
        const customerId = get(data, "customer.connect.id");
        const customerObj = await customer.get(customerId, ctx);
        if (!customerObj) {
          throw new ForbiddenError(
            "Not allowed to create project under given customer",
          );
        }
      }

      if (get(data, "customer.create")) {
        // connect current company to customer
        data.customer.create = {
          ...data.customer.create,
          company: {
            connect: {
              id: get(ctx, "auth.company.id"),
            },
          },
        };
      }

      // get all project services
      const projectServices = get(data, "projectService.create", []);
      for (const projectService of projectServices) {
        const serviceId = get(projectService, "service.connect.id");
        // check if user want to connect to already existing service
        if (serviceId) {
          // check whether service belongs to company(from header) or not
          const serviceObj = await service.get(serviceId, ctx);
          if (!serviceObj) {
            throw new ForbiddenError(
              "Not allowed to create project with given service",
            );
          }
        }

        if (get(projectService, "service.create")) {
          projectService.service.create = {
            ...projectService.service.create,
            company: {
              connect: {
                id: get(ctx, "auth.company.id"),
              },
            },
          };
        }
      }

      const createdProject = await ctx.db.mutation.createProject(
        {
          data: {
            description: data.description,
            endsAt: null,
            isArchived: false,
            name: data.name,
            startsAt: data.startsAt,
            status: data.status,
            customer: data.customer,
            projectService: data.projectService,
            company: {
              connect: {
                id: get(ctx, "auth.company.id"),
              },
            },
          },
        },
        info,
      );
      return createdProject;
    },
    updateProject: async (_, { where, data }, ctx, info) => {
      const projectObj = await project.get(where.id, ctx, info);
      if (projectObj) {
        // validate all create project services
        const projectServices = get(data, "projectService.create", []);
        for (const projectService of projectServices) {
          const serviceId = get(projectService, "service.connect.id");
          // check if user want to connect to already existing service
          if (serviceId) {
            // check whether service belongs to company(from header) or not
            const serviceObj = await service.get(serviceId, ctx);
            if (!serviceObj) {
              throw new ForbiddenError(
                "Not allowed to update project with given service: " +
                  serviceId,
              );
            }
          }

          if (get(projectService, "service.create")) {
            projectService.service.create = {
              ...projectService.service.create,
              company: {
                connect: {
                  id: get(ctx, "auth.company.id"),
                },
              },
            };
          }
        }

        return await ctx.db.mutation.updateProject(
          {
            data: {
              description: data.description,
              endsAt: data.endsAt,
              isArchived: data.isArchived,
              name: data.name,
              startsAt: data.startsAt,
              status: data.status,
              projectService: data.projectService,
            },
            where,
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Project"));
      }
    },
    deleteProject: async (_, { where }, ctx, info) => {
      const projectObj = await project.get(where.id, ctx, info);
      if (projectObj) {
        return await ctx.db.mutation.updateProject(
          {
            data: {
              isDeleted: true,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Project"));
      }
    },
  },
};
