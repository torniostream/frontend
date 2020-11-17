# Tornio Stream frontend

This project is the frontend for tornio.stream, which is a service aimed to play movies in real-time with your friends. It is based on Kurento Media Server, and it uses Spring Boot as a backend. This frontend is based on Angular.

![The player](https://i.imgur.com/BwTtLNS.jpg)

## How to hack
### Start back-end and Kurento Media Server (KMS)

```shell
sudo docker-compose up -d
```

### Build and run
Open a shell and type the following:
```shell
ng serve --open --proxy-config src/proxy.conf.json # This last bit is really important
```

### Start hacking!
Now you have everything needed up and running. To play a movie go to [http://127.0.0.1:8082](http://127.0.0.1:8082) and paste a link to a mp4 file. To obtain the room id you have to dig inside the logs of docker-compose with ```sudo docker-compose logs -f backend``` and search for a line that says: "code uuid xxxxx-xxxxxxx-xxxxxxxxx" or "Codice: xxxxxx-xxxxx-xxxxxxxx". 

Beware that if you press Play more than once a new room will be created. I know it's ugly, but it is what it is until we don't get waiting room up and running :) Plz contribute to `feat/waitingroom`.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
