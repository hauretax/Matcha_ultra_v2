// errors.ts
export class UniqueConstraintError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = "UniqueConstraintError";
	}
}

export class DatabaseError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = "DatabaseError";
	}
}
