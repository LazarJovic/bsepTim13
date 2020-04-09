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

    fromStringArray(keyUsages: Array<string>) {
        this.digitalSignature = false;
        this.nonRepudiation = false;
        this.keyEncipherment = false;
        this.dataEncipherment = false;
        this.keyAgreement = false;
        this.keyCertSign = false;
        this.CRLSign = false;
        this.encipherOnly = false;
        this.decipherOnly = false;
        for (let i = 0; i < 9; i++) {
            if (!keyUsages[i])
                return
            if (keyUsages[i] === "digitalSignature") {
                this.digitalSignature = true;
                continue;
            }
            if (keyUsages[i] === "nonRepudiation") {
                this.nonRepudiation = true;
                continue;
            }
            if (keyUsages[i] === "keyEncipherment") {
                this.keyEncipherment = true;
                continue;
            }
            if (keyUsages[i] === "dataEncipherment") {
                this.dataEncipherment = true;
                continue;
            }
            if (keyUsages[i] === "keyAgreement") {
                this.keyAgreement = true;
                continue;
            }
            if (keyUsages[i] === "keyCertSign") {
                this.keyCertSign = true;
                continue;
            }
            if (keyUsages[i] === "cRLSign") {
                this.CRLSign = true;
                continue;
            }
            if (keyUsages[i] === "encipherOnly") {
                this.encipherOnly = true;
                continue;
            }
            if (keyUsages[i] === "decipherOnly") {
                this.decipherOnly = true;
                continue;
            }
        }
    }

}