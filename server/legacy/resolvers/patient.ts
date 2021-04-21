import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import fs from "fs";
import os from "os";
import path from "path";
import patient from "src/db/models/patient";
import customer from "src/db/models/customer";
import { ERRORS, S3_ATTACHMENT } from "src/helpers/constants";
import idx from "idx";
import { Parser } from "json2csv";
import { S3 } from "src/helpers";
import moment from "moment";

export default {
  Query: {
    patient: async (_, { where }, ctx, info) => {
      return await patient.get(where.id, ctx, info);
    },
    patients: async (_, args, ctx, info) => {
      const patients = await ctx.db.query.patientsConnection(
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
        info
      );
      return patients;
    },
  },
  Mutation: {
    createPatient: async (_, { data }, ctx, info) => {
      const res = await ctx.db.mutation.createPatient(
        {
          data: {
            title: data.title,
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            address: data.address,
            birthAddress: data.birthAddress,
            names: data.names,
            dvaCardType: data.dvaCardType,
            aboriginalStatus: data.aboriginalStatus,
            pensionerConcession: data.pensionerConcession,
            commonwealthSeniors: data.commonwealthSeniors,
            healthcareConcession: data.healthcareConcession,
            safetyNetConcession: data.safetyNetConcession,
            medicareNumber: data.medicareNumber,
            DVA: data.DVA,
            potentialDuplicate: data.potentialDuplicate,
            oneName: data.oneName,
            ihi: data.ihi,
            ihiValidatedDate: data.ihiValidatedDate,
            noOfBirths: data.noOfBirths,
            deceasedDate: data.deceasedDate,
            isArchived: false,
            company: {
              connect: {
                id: get(ctx, "auth.company.id"),
              },
            },
          },
        },
        info
      );
      // Create Customer Also
      await customer.create({
        isArchived: false,
        name: `${data.firstName} ${data.lastName}`,
        addresses: idx(res, x => x.address.id)
          ? {
              connect: [{ id: idx(res, x => x.address.id) }],
            }
          : undefined,
        company: {
          connect: {
            id: get(ctx, "auth.company.id"),
          },
        },
      });
      return res;
    },
    updatePatient: async (_, { where, data }, ctx, info) => {
      const obj = await patient.get(where.id, ctx, info);
      if (obj) {
        let res = await ctx.db.mutation.updatePatient(
          {
            data: {
              title: data.title,
              ihi: data.ihi,
              firstName: data.firstName,
              lastName: data.lastName,
              dateOfBirth: data.dateOfBirth,
              gender: data.gender,
              address: data.address,
              birthAddress: data.birthAddress,
              dvaCardType: data.dvaCardType,
              aboriginalStatus: data.aboriginalStatus,
              pensionerConcession: data.pensionerConcession,
              commonwealthSeniors: data.commonwealthSeniors,
              healthcareConcession: data.healthcareConcession,
              safetyNetConcession: data.safetyNetConcession,
              medicareNumber: data.medicareNumber,
              DVA: data.DVA,
              potentialDuplicate: data.potentialDuplicate,
              oneName: data.oneName,
              ihiValidatedDate: data.ihiValidatedDate,
              noOfBirths: data.noOfBirths,
              deceasedDate: data.deceasedDate,
              isArchived: data.isArchived,
              names: data.names,
            },
            where: {
              id: where.id,
            },
          },
          info
        );
        return res;
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Patient"));
      }
    },
    deletePatient: async (_, { where }, ctx, info) => {
      const obj = await patient.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updatePatient(
          {
            data: {
              isDeleted: true,
            },
            where: {
              id: where.id,
            },
          },
          info
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Patient"));
      }
    },
    uploadBulkPatients: async (_, { data }, ctx, info) => {
      const companyId = get(ctx, "auth.company.id");
      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(data);
      const fileName = moment().format("YYYYMMDD-hhmmss");
      const filePath = path.resolve(os.tmpdir(), `./${fileName}.csv`);
      // write csv data to temporary file
      await fs.promises.writeFile(filePath, csv, "utf8");
      const type = S3_ATTACHMENT.PATIENT_BULK_UPLOAD.type;
      const s3Data = {
        fileName,
        mimetype: "text/csv",
        stream: fs.createReadStream(filePath),
      };
      // upload file to s3
      await S3.uploadFile(companyId, type, s3Data);
      // remove temporary local csv file
      await fs.promises.unlink(filePath);
      return {
        success: true,
      };
    },
  },
};
