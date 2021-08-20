import configApi from './configApi';
import { getBaseUrl } from './main';

export function dateToUrl (date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function isValidDate(d : Date) : boolean
{
  return d instanceof Date && isFinite(d as any);
}

export function dateToString (date: Date): string {
  if(isValidDate(date))
  {
    return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
  }

  return '';
}

export async function getEntities(search: string, exclude: number[], apiPath: string) {
  return postFetch({ search, exclude }, apiPath);
}

export async function getEntity(entity: object, apiPath: string) {
  return postFetch(entity, 'get'+apiPath);
}

export async function addEntity(entity: object, apiPath: string) {
  return postFetch(entity, 'add'+apiPath);
}

export async function deleteEntity(entity: object, apiPath: string) {
  return postFetch(entity, 'delete'+apiPath);
}

export async function uploadFile(formData: FormData, apiPath: string) {
  const request: RequestInit = {
    ...configApi.fetch,
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    body: formData, // body data type must match "Content-Type" header
  };

  const response = await fetch(getBaseUrl() + 'home/' + apiPath, request);

  if (response.ok) {
    return response.json();
  } else {
    throw await response.text();
  }
}

export async function postFetch(body: object, apiPath: string) {
  const request: RequestInit = {
    ...configApi.fetch,
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'multipart/form-data'
      //'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(body), // body data type must match "Content-Type" header
  };

  const response = await fetch(getBaseUrl() + 'home/' + apiPath, request);

  if (response.ok) {
    return response.json();
  } else {
    throw await response.text();
  }
}
