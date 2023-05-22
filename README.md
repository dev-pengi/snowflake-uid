# Snowflake-UID

The Snowflake-UID module is a utility for generating unique Snowflake IDs based on the Snowflake algorithm.

## Installation

You can install the module using npm:

```bash
npm install snowflake-uid
```

## Configuration & Usage
The module provides options for configuration:

- **epoch** (required): The starting timestamp in milliseconds since the UNIX epoch. It determines the time range of the generated Snowflake IDs.
- **workerId** (optional): The ID of the worker or machine generating the IDs. It helps in preventing ID collisions in a distributed system.
- **processId** (optional): The ID of the process generating the IDs. It further refines the uniqueness in cases where multiple processes are running on a single machine.

```js
const Snowflake = require('snowflake-uid');

const config = {
  epoch: 1546300800000, // Example: Set the epoch to January 1, 2019 at 00:00:00
  workerId: 1, // Example: Set the worker ID to 1
  processId: 1, // Example: Set the process ID to 1
};

const snowflake = new Snowflake(config);
const snowflakeId = snowflake.generate();
console.log(snowflakeId);
```

Note: make sure that the epoch value is set correctly and matches the time range you intend to generate Snowflake IDs for.