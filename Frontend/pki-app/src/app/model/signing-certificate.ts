export class SigningCertificate {
    
    public issuerCommonName: string;
    public issuerEmail: string;
    public issuerId: number;
    public serialNum: string;
    public validFrom: string;
    public validTo: string;
    public keyUsage: string[];
    public extendedKeyUsage: string[];

    constructor(issuerCommonName: string, issuerEmail: string, issuerId: number, serialNum: string, validFrom: string,
        validTo: string, keyUsage: string[], extendedKeyUsage: string[]) {
        this.issuerCommonName = issuerCommonName;
        this.issuerEmail = issuerEmail;
        this.issuerId = issuerId;
        this.serialNum = serialNum;
        this.validFrom = validFrom;
        this.validTo = validTo;
        this.keyUsage = keyUsage;
        this.extendedKeyUsage = extendedKeyUsage;
    }
    
}