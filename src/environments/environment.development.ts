//src/environments/environment.development.ts
export const environment = {
  production: false,
  apiUrl: 'https://odonto-api.duckdns.org',
  keycloak: {
    url: 'https://odonto-auth.duckdns.org',
    realm: 'odontostyle-realm',
    clientId: 'angular-frontend'
  }
};