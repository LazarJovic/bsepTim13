export class Template {

    public id: number;
    public signatureAlgorithm: string;
    public keyAlgorithm: string;
    public keyUsage: Array<string>;
    public extendedKeyUsage: Array<string>;
    public name: string;

    constructor(id: number, signatureAlgorithm: string, keyAlgorithm: string, keyUsage: Array<string>,
        extendedKeyUsage: Array<string>, name: string) {
        this.id = id;
        this.signatureAlgorithm = signatureAlgorithm;
        this.keyAlgorithm = keyAlgorithm;
        this.keyUsage = keyUsage;
        this.extendedKeyUsage = extendedKeyUsage;
        this.name = name;
    }
    
}