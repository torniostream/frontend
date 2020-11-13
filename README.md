# Tornio Stream frontend

This project is the frontend for tornio.stream, which is a service aimed to play movies in real-time with your friends. It is based on Kurento Media Server, and it uses Spring Boot as a backend. This frontend is based on Angular.

## Docker image

If you wanna see how the frontend looks like, you can use Docker:
``` bash
# docker run --rm -p4200:4200 kriive/kurento-frontend:latest # Head to 127.0.0.1:4200
```

## Contributing

The project was started just yet, so we still have to adjust and find a workflow that works for us. Instructions on how to carry out the simplest development actions follow:

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
