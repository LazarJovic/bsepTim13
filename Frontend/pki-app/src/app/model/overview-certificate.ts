export class OverviewCertificate {
    
    public issuerCommonName: string;
    public issuerEmail: string;
    public issuerId: number;
    public subjectCommonName: string;
    public subjectEmail: string;
    public subjectId: number;
    public serialNum: string;
    public validFrom: string;
    public validTo: string;

    constructor(issuerCommonName: string, issuerEmail: string, issuerId: number, subjectCommonName: string, subjectEmail: string, 
        subjectId: number, serialNum: string, validFrom: string,
        validTo: string) {
        this.issuerCommonName = issuerCommonName;
        this.issuerEmail = issuerEmail;
        this.issuerId = issuerId;
        this.subjectCommonName = subjectCommonName;
        this.subjectEmail = subjectEmail;
        this.subjectId = subjectId;
        this.serialNum = serialNum;
        this.validFrom = validFrom;
        this.validTo = validTo;
    }
    
}