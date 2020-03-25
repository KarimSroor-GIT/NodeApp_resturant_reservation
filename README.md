# Nadia’s Garden Restaurant

This is a Node.js and Express website that accepts and lists restaurant reservations following guides from the linkedin course, "Node.js: Testing and Code Quality" by Jon Peck.



## Getting Started

```bash
npm install
npm start
```

The server runs on port 3000.

There are three routes:

- http://localhost:3000/ - homepage
- http://localhost:3000/reservations - submit a reservation booking request
- http://localhost:3000/admin - view all booking requests; basic auth login/password `admin`

The server persists using a SQLite3 database named `database.sqlite` in the site root.

## Development

### Debugging

This project uses https://www.npmjs.com/package/debug for development logging. To start `nodemon` and enable logging:

```bash
npm run debug
```



