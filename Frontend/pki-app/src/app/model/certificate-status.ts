export class CertificateStatus {

    public isValid: boolean;
    public isRevoked: boolean;

    constructor(isValid: boolean, isRevoked: boolean) {
        this.isValid = isValid;
        this.isRevoked = isRevoked;
    }
}