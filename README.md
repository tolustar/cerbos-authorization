## Authorization in NodeJs using Cerbos

### Steps to run the project

1. `docker run --rm --name cerbos -d -v $(pwd)/cerbos-authorization/policies:/policies -p 3592:3592 ghcr.io/cerbos/cerbos:0.4.0` in the root folder
2. Run `npm install`
3. Run `npm start`

### Test

Run `npm test`
