import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import json from './swagger.json';

export async function swagger(server: any) {
  if (!process.env.NODE_ENV) {
    const options = {
      definition: json,
      apis: [],
    };

    const swaggerSpec = swaggerJSDoc(options);

    server.get('/swagger.json', function (req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
    server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }
}
