# WebdriverIO - Cucumber

This project showcases web automation testing for [PHPTRAVELS](https://phptravels.com/), utilize [WebdriverIO](https://webdriver.io/) and implement BDD with [Cucumber](https://cucumber.io/) framework in a **Dockerized environment**. 

## 📦 Prerequisites 

- Docker
- NodeJS v20.18.0
- Docker Compose
- Allure Report

## 💿 Installation

Build and start the Selenium Grid container using `docker-compose`.

```shell
docker compose -f ./docker/docker-seleniumgrid-compose-v3.yml up -d
```


Run `npm install` to install necessary libraries
```shell
npm install
```

Build the image for the WebdriverIO project.
```shell
docker build -t wdio-tests -f ./docker/dockerfile-wdio .
```

## ▶️ Execution

Basically the test can be executed by following command 
```shell
npx wdio run wdio.conf.ts
```
Or you can running using `docker-compose`
```shel
docker compose -f ./docker/docker-compose-wdio.yml up -d
```

But I prefer using [Cucumber tags](https://cucumber.io/docs/cucumber/api/#tags) expression to run specific scenario or feature.

```shell
CUCUMBER_TAGS="@HotelFeature" docker compose -f ./docker/docker-compose-wdio.yml up -d
```
The execution can be viewed on the selenium grid by accessing `localhost:4444`

![2025-02-21_07-19](https://github.com/user-attachments/assets/090f636c-aca0-4c71-b891-efd5f44abf2a)

![image](https://github.com/user-attachments/assets/ad60eaf0-622d-4e00-8c32-34878ec4bb69)


## 📜 Reporting

I use [Allure Report](https://allurereport.org/docs/webdriverio/) to provide reporting process and testing step documentation. The report can be generated and opened by following command.
```shell
# run following command to generate report
npm run allure:generate
# run following command to open the report
npm run allure:open
```
Or a straightforward command like 
```shell
allure serve allure-results/
```

![image](https://github.com/user-attachments/assets/fd953881-c4ef-4972-bbee-57b9eef5081b)

