export class ExtKeyUsage {

    public serverAuth: boolean;
    public clientAuth: boolean;
    public codeSigning: boolean;
    public emailProtection: boolean;
    public timeStamping: boolean;
    public ocspSigning: boolean;
    public ipsecEndSystem: boolean;
    public ipsecTunnel: boolean;
    public ipsecUser: boolean;

    constructor(serverAuth: boolean, clientAuth: boolean, codeSigning: boolean, emailProtection: boolean,
        timeStamping: boolean, ocspSigning: boolean, ipsecEndSystem: boolean, ipsecTunnel: boolean, ipsecUser: boolean) {
        this.serverAuth = serverAuth;
        this.clientAuth = clientAuth;
        this.codeSigning = codeSigning;
        this.emailProtection = emailProtection;
        this.timeStamping = timeStamping;
        this.ocspSigning = ocspSigning;
        this.ipsecEndSystem = ipsecEndSystem;
        this.ipsecTunnel = ipsecTunnel;
        this.ipsecUser = ipsecUser;
    }
    

}