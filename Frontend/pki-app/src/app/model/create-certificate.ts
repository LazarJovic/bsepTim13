export class CreateCertificate {

    public id: number;
    public issuerId: number;
    public issuerIssuerEmail: string;
    public issuerEmail: string;
    public serialNum: string;
    public issuerCommonName: string;
    public issuerValidFrom: string;
    public issuerValidTo: string;
    public validFrom: string;
    public validTo: string;
    public subjectId: number;
    public subjectCommonName: string;
    public subjectEmail: string;
    public signatureAlgorithm: string;
    public keyAlgorithm: string;
    public keyUsage: Array<string>;
    public extendedKeyUsage: Array<string>;
    public keyUsageChecked: boolean;
    public extendedKeyUsageChecked: boolean;

    constructor(id: number, issuerId: number, issuerIssuerEmail: string, issuerEmail: string, serialNum: string,
        issuerCommonName: string, issuerValidFrom: string, issuerValidTo: string, validFrom: string, validTo: string,
        subjectId: number, subjectCommonName: string, subjectEmail: string, signatureAlgorithm: string, keyAlgorithm: string, keyUsage: Array<string>,
        extendedKeyUsage: Array<string>, keyUsageChecked: boolean, extendedKeyUsageChecked: boolean) {
        this.issuerId = issuerId;
        this.issuerIssuerEmail = issuerIssuerEmail;
        this.issuerEmail = issuerEmail;
        this.serialNum = serialNum;
        this.issuerCommonName = issuerCommonName;
        this.issuerValidFrom = issuerValidFrom;
        this.issuerValidTo = issuerValidTo;
        this.validFrom = validFrom;
        this.validTo = validTo;
        this.subjectId = subjectId;
        this.subjectCommonName = subjectCommonName;
        this.subjectEmail = subjectEmail;
        this.signatureAlgorithm = signatureAlgorithm;
        this.keyAlgorithm = keyAlgorithm;
        this.keyUsage = keyUsage;
        this.extendedKeyUsage = extendedKeyUsage;
        this.keyUsageChecked = keyUsageChecked;
        this.extendedKeyUsageChecked = extendedKeyUsageChecked;
    }
    
}