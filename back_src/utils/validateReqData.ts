import { Request } from 'express';


export function validateRequestData<T extends object>(requestData: any, interfaceModel: T): boolean {
  const interfaceKeys = Object.keys(interfaceModel);
  const requestDataKeys = Object.keys(requestData);
  const missingFields = interfaceKeys.filter((key) => !requestDataKeys.includes(key));
  return missingFields.length === 0;
}