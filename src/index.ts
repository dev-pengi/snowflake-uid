export interface SnowFlakeConfig {
  epoch: number;
  workerId?: number;
  processId?: number;
  toString?: boolean;
}
export class Snowflake {
  private readonly EPOCH: number;
  private static lastTimestamp = -1;
  private static sequence = 0;
  private readonly workerId: number;
  private readonly processId: number;
  private readonly toString: boolean;
  private static readonly WORKER_ID_BITS = 5;
  private static readonly PROCESS_ID_BITS = 5;
  private static readonly SEQUENCE_BITS = 12;

  constructor({
    epoch,
    workerId = 1,
    processId = 1,
    toString = false,
  }: SnowFlakeConfig) {
    const currentTimestamp = Date.now();

    if (epoch > currentTimestamp) {
      throw new Error("Provided EPOCH is greater than the current timestamp");
    }

    this.EPOCH = epoch;
    this.workerId = workerId;
    this.processId = processId;
    this.toString = toString;
  }

  generate(): string | number {
    let timestamp = Date.now();

    if (timestamp < Snowflake.lastTimestamp) {
      throw new Error("Invalid system clock");
    }

    if (timestamp === Snowflake.lastTimestamp) {
      Snowflake.sequence =
        (Snowflake.sequence + 1) & ((1 << Snowflake.SEQUENCE_BITS) - 1); // Increment and reset if it exceeds the sequence bits
      if (Snowflake.sequence === 0) {
        timestamp = this.waitUntilNextMillis();
      }
    } else {
      Snowflake.sequence = 0;
    }

    Snowflake.lastTimestamp = timestamp;

    const timestampOffset = timestamp - this.EPOCH;
    const timestampBits = timestampOffset.toString(2).padStart(42, "0");

    const workerIdBits = this.workerId
      .toString(2)
      .padStart(Snowflake.WORKER_ID_BITS, "0");
    const processIdBits = this.processId
      .toString(2)
      .padStart(Snowflake.PROCESS_ID_BITS, "0");
    const sequenceBits = Snowflake.sequence
      .toString(2)
      .padStart(Snowflake.SEQUENCE_BITS, "0");

    const idBinary = `${timestampBits}${workerIdBits}${processIdBits}${sequenceBits}`;
    const idDecimal = BigInt("0b" + idBinary).toString();

    if (this.toString) return idDecimal.toString();
    else return idDecimal;
  }

  private waitUntilNextMillis(): number {
    let timestamp = Date.now();
    while (timestamp <= Snowflake.lastTimestamp) {
      timestamp = Date.now();
    }
    return timestamp;
  }
}
