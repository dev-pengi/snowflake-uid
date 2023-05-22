export default class Snowflake {
    private readonly EPOCH: number;
    private static increment = 0;
    private static lastTimestamp = -1;

    constructor(private readonly workerId: number = 1, private readonly processId: number = 1, epoch: number) {
        const currentTimestamp = Date.now();

        if (epoch > currentTimestamp) {
            throw new Error('Provided EPOCH is greater than the current timestamp');
        }

        this.EPOCH = epoch;
    }

    generate(): string {
        let timestamp = Date.now();

        if (timestamp < Snowflake.lastTimestamp) {
            throw new Error('Invalid system clock');
        }

        if (timestamp === Snowflake.lastTimestamp) {
            Snowflake.increment = (Snowflake.increment + 1) % 4096; // Increment and reset if it exceeds 4095
            if (Snowflake.increment === 0) {
                timestamp = this.waitUntilNextMillis();
            }
        } else {
            Snowflake.increment = 0;
        }

        Snowflake.lastTimestamp = timestamp;

        const timestampBits = (timestamp - this.EPOCH).toString(2).padStart(42, '0');
        const workerIdBits = this.workerId.toString(2).padStart(5, '0');
        const processIdBits = this.processId.toString(2).padStart(5, '0');
        const incrementBits = Snowflake.increment.toString(2).padStart(12, '0');

        const idBinary = `${timestampBits}${workerIdBits}${processIdBits}${incrementBits}`;
        const idDecimal = parseInt(idBinary, 2).toString();

        return idDecimal;
    }

    private waitUntilNextMillis(): number {
        let timestamp = Date.now();
        while (timestamp <= Snowflake.lastTimestamp) {
            timestamp = Date.now();
        }
        return timestamp;
    }
}
