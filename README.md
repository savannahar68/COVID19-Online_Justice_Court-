## Running / verifying the project via Docker

Once [you have Docker installed](https://docs.docker.com/install/), the following command will spin up a Docker container with the UI, API, local S3, local Dynamo, etc. all running inside it:

`./docker-run.sh`

- You can access the UI at http://localhost:1234
- You can access the public UI at http://localhost:5678
- You can access the API at http://localhost:3000
- You can access the DynamoDB shell at http://localhost:8000/shell
- You can access the DynamoDB admin UI at http://localhost:8001
- You can access S3 local at http://localhost:9000
- You can access the style guide at http://localhost:1234/style-guide

Within Docker, you should allocate 4 CPUs, 16 GB of RAM, and 4 GB of swap. With fewer resources, the software is likely to fail to run with errors that don’t make it obvious what the problem is.

### ECR
ECR is Amazon’s docker container registry that holds images for `ef-cms` builds on CircleCI. Currently, images can be managed in the AWS ECR console under the `ef-cms-us-east-1`. If you need to update the Docker image, you can do so (with appropriate permissions) by running `./docker-to-ecr.sh`. This command will build an image per the `Dockerfile-CI` config, tag it as `latest` and push it to the repo in ECR.

## Running this project locally without Docker

The EF-CMS is comprised of two components: the API and the UI. Both must be run in order to function.

### Prerequisites

- Node v12.13.1
- npm v6.12.1
- ClamAV v0.101.2 (see Setup below)
-  Java 11

### Setup

- Install the JDK from https://www.oracle.com/java/technologies/javase-jdk13-downloads.html
For ClamAV, macOS users can do the following:
- `brew install clamav`
- `cp /usr/local/etc/clamav/freshclam.conf.sample /usr/local/etc/clamav/freshclam.conf`
- `sed -ie 's/^Example/#Example/g' /usr/local/etc/clamav/freshclam.conf` (comments out `Example` in the `freshclam.conf` file)

Both the front-end (`/web-client`) and API (`/web-api`) share code that exists in `/shared`. Before you can run either, you need to run `npm install` inside the top-level directory.

- `npm i`

#### Terminal A

- `npm run start:api`

##### Other Start Commands

- Run `cd web-client && npm run start:client:no-scanner` to start the UI without Dynamsoft (or if you don't have a scanner)
- Run `npm run start:public` to start the UI for the public access portion of the site

#### Terminal B

- `npm run start:client`

## Login and test users

There are two login mechanisms available — the legacy mock login system, and a new one that emulates AWS Cognito.

### Mock login

You can log in using the following accounts.

#### External Users

```
petitioner
privatePractitioner
privatePractitioner1 - privatePractitioner4
irsPractitioner
irsPractitioner1 - irsPractitioner4
```

#### Internal Users
```
judgeSavan
adc
admissionsclerk
clerkofcourt
docketclerk
docketclerk1
petitionsclerk
petitionsclerk1
trialclerk
judgeSavan
SavansChambers
judgeKunalKamra
KunalKamrasChambers
judgeBuch
buchsChambers
judgeCarluzzo
carluzzosChambers
judgeCohen
cohensChambers
```

No password is required.