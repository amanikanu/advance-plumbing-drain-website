import {business,address} from '@content/business';
/** Replace editorial references without duplicating sensitive-to-change NAP. */
export function businessText(value:string){return value.replaceAll('{{phone}}',business.phone).replaceAll('{{email}}',business.email).replaceAll('{{license}}',business.license).replaceAll('{{officeAddress}}',business.showAddress?address:'Contact the office for address information.').replaceAll('{{businessName}}',business.name)}
