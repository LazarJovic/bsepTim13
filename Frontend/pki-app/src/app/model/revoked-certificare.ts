export class RevokedCertificate {

    public id: number;
    public alias: string;

    constructor(id: number, alias: string) {
        this.id = id;
        this.alias = alias;
    }
}