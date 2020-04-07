export class CreateCertificate {

    public id: number;
    public issuerId: number;
    public issuerEmail: string;
    public serialNum: string;
    public issuerCommonName: string;
    public validFrom: string;
    public validTo: string;
    public subjectId: number;
    public subjectCommonName: string;
    public signatureAlgorithm: string;
    public keyAlgorithm: string;
    public keyUsage: Array<string>;
    // public extendedKeyUsage: Array<string>;

    constructor(id: number, issuerId: number, issuerEmail: string, serialNum: string, issuerCommonName: string, validFrom: string, validTo: string,
        subjectId: number, subjectCommonName: string, signatureAlgorithm: string, keyAlgorithm: string, keyUsage: Array<string>) {
        this.issuerId = issuerId;
        this.issuerEmail = issuerEmail;
        this.serialNum = serialNum;
        this.issuerCommonName = issuerCommonName;
        this.validFrom = validFrom;
        this.validTo = validTo;
        this.subjectId = subjectId;
        this.subjectCommonName = subjectCommonName;
        this.signatureAlgorithm = signatureAlgorithm;
        this.keyAlgorithm = keyAlgorithm;
        this.keyUsage = keyUsage;
        // this.extendedKeyUsage = extendedKeyUsage;
    }
    
}