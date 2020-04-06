export class KeyUsage {

    public digitalSignature: boolean;
    public nonRepudiation: boolean;
    public keyEncipherment: boolean;
    public dataEncipherment: boolean;
    public keyAgreement: boolean;
    public keyCertSign: boolean;
    public CRLSign: boolean;
    public encipherOnly: boolean;
    public decipherOnly: boolean;

    constructor(digitalSignature: boolean, nonRepudiation: boolean, keyEncipherment: boolean, dataEncipherment: boolean,
        keyAgreement: boolean, keyCertSign: boolean, CRLSign: boolean, encipherOnly: boolean, decipherOnly: boolean) {
        this.digitalSignature = digitalSignature;
        this.nonRepudiation = nonRepudiation;
        this.keyEncipherment = keyEncipherment;
        this.dataEncipherment = dataEncipherment;
        this.keyAgreement = keyAgreement;
        this.keyCertSign = keyCertSign;
        this.CRLSign = CRLSign;
        this.encipherOnly = encipherOnly;
        this.decipherOnly = decipherOnly;
    }
    

}