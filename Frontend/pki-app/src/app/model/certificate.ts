export class Certificate {

    public serialNum: string;
    public issuer: string;
    public subject: string;
    public validFrom: string;
    public ValidTo: string;

    // constructor(serialNum: string, issuer: string, subject: string, validFrom: string, ValidTo: string) {
    //     this.serialNum = serialNum;
    //     this.issuer = issuer;
    //     this.subject = subject;
    //     this.validFrom = validFrom;
    //     this.ValidTo = ValidTo;
    // }

    constructor() {
        this.serialNum = "123";
        this.issuer = "Tako neki Issuer";
        this.subject = "Tako neki Subject";
        this.validFrom = "3/19/2019";
        this.ValidTo = "3/19/2019";
    }
    
}