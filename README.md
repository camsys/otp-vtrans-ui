# OTP VTrans UI

Front-end interface for VTRANS [OpenTripPlanner](http://opentripplanner.org) project. Forked from [otp.js](https://github.com/conveyal/otp.js.git)

The main difference between otp.js and this fork is: additional icons and behaviors for flexible transportation modes (see [GTFS-flex reference](https://github.com/CUTR-at-USF/gtfs-flex/blob/master/spec/reference.md)).

The build management system has been switched to [Webpack](http://webpack.js.org/).

## Getting Started

To get started: [ ]

1. Clone the otp.js repo to your local machine using `git clone https://github.com/camsys/otp-vtrans-ui`. Run `git checkout vtrans-dev`.

2. Install [npm](https://www.npmjs.org/) if needed. In the project directory, run `npm install` to install dependencies and set up the development environment (this in configured in package.json).

3. Copy the client configuration template from `src/config.js.template` to `src/config.js`; update `src/config.js` to reflect your specific setup including OTP backend, Mapbox keys, geocoder endpoints, etc.

4. Run `npm run build` to package the project and put it in `dist`.

5. For development: run `npm run serve` to run a Webpack dev server which builds the project, serves it locally, and rebuilds on changes to the source files.

6. Deploy the client to the web by copying the `dist` directory to your web server.
