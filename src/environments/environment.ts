//src/envitoments/enviroment.ts

export const environment = {
  production: true,
  apiUrl: 'https://odonto-api.duckdns.org',
  keycloak: {
    url: 'https://odonto-auth.duckdns.org',
    realm: 'odontostyle-realm',
    clientId: 'angular-frontend'
  }
};