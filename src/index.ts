export interface Ratelimit_Record {
	timestamp: number;
	left: number;
}

export default class Ratelimit {
	private readonly max: number;
	private readonly period: number;

	private records: Record<string, Ratelimit_Record> = {};

	constructor(max: number, period: number) {
		this.max = max;
		this.period = period;

		setInterval(() => {
			const timestamp = Date.now();

			for (const ip in this.records) {
				if (timestamp - this.records[ip].timestamp < this.period) {
					break;
				}

				delete this.records[ip];
			}
		}, this.period);
	}

	public consume(ip: string, points = 1): boolean {
		const timestamp = Date.now();

		let record = this.records[ip];

		if (!record) {
			record = this.initialize(ip, timestamp);
		} else if (timestamp - record.timestamp >= this.period) {
			delete this.records[ip];
			record = this.initialize(ip, timestamp);
		}

		return record.left > 0 && (record.left -= points) > 0;
	}

	private initialize(ip: string, timestamp: number): Ratelimit_Record {
		return this.records[ip] = {
			timestamp: timestamp,
			left: this.max,
		};
	}
}
