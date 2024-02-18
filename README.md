# Text Justifcation REST API

This is a Nodejs API that delivers precise text justification, built from scratch without external libraries.

## Features:

- Customizable line length (default 80)
- Token-based authentication.
- Rate limiting.
- No external dependencies.

## Get Started:

- Clone the repo, install dependencies (npm install).
- Start the server (node app.js).
- Get a token: POST to `/api/token` with your email.

  - Request body: credentials of the user (only email for simplicity)

  ```JSON
  {
      "email": "exmaple@email.com"
  }
  ```

  - Response: `200 OK` (success)
  - Response body: authentication token

  ```JSON
  {
      "token": "c3b8d432ff6f35c1825de248e286ad80"
  }
  ```

- Justify text: POST to `/api/justify` with text and your token in the Authorization header.

  - Request body: text to be justified

  ```text
    This is an example of   some text that
    needs justification.
  ```

  - Response: `200 OK` (success)
  - Response body: justified text

  ```text
    This is an example of some text that needs justification.
  ```

## Example:

Bash

## Get token

```bash
    curl -X POST -H "Content-Type: application/json" -d '{"email": "your_email@example.com"}' http://localhost:3000/api/token
```

## Justify text

```bash
    curl -X POST -H "Authorization: Bearer <your_token>" -H "Content-Type: text/plain" -d 'This text needs alignment.' http://localhost:3000/api/justify
```

## License:

MIT. See LICENSE file for details.
