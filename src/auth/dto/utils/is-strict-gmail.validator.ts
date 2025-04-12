import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsStrictGmailConstraint implements ValidatorConstraintInterface {
  validate(email: any, args: ValidationArguments) {
    if (typeof email !== 'string') return false;

    // Only allow gmail.com or google.com
    const allowedDomains = ['gmail.com', 'google.com'];
    const emailParts = email.split('@');
    if (emailParts.length !== 2) return false;

    const [localPart, domain] = emailParts;

    // Block if domain is not allowed
    if (!allowedDomains.includes(domain)) return false;

    // Block if '+' trick is used in gmail
    if (domain === 'gmail.com' && localPart.includes('+')) return false;

    // Block if domain is google.com but original is meant to be gmail.com
    // Optional: you can tie this with original user email logic if needed

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid Gmail/Google email. Aliases or tricks are not allowed.';
  }
}

export function IsStrictGmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrictGmailConstraint,
    });
  };
}
