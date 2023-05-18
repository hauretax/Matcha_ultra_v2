import { Request } from 'express';

export function validateRequestData<T extends object>(requestData: any, interfaceModel: T): boolean {
  const interfaceKeys = Object.keys(interfaceModel);
  const requestDataKeys = Object.keys(requestData);


  
  // Vérifier si toutes les propriétés de l'interface sont présentes dans les données reçues
  const missingFields = interfaceKeys.filter((key) => !requestDataKeys.includes(key));

  return missingFields.length === 0;
}