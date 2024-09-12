import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { AppDataSource } from 'ormconfig';

@ValidatorConstraint({ async: false })
export class Unique implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const entity = args.constraints[0];
    const targetColumnName = args.constraints[1] || args.property;

    var queryParams = {};
    queryParams[targetColumnName] = value;

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const isUnique = await AppDataSource.getRepository(entity).findOneBy(queryParams);

    return !isUnique;
  }

  defaultMessage(args: ValidationArguments) {
    const entity = args.constraints[1] || args.property;
    return `${entity} already exist.`;
  }
}
