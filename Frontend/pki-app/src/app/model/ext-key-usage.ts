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
    
    toStringArray() {
        let keyUsages: string[];
        if (this.serverAuth) {
            keyUsages.push("serverAuth");
        }
        if (this.clientAuth) {
            keyUsages.push("clientAuth");
        }
        if (this.codeSigning) {
            keyUsages.push("codeSigning");
        }
        if (this.emailProtection) {
            keyUsages.push("emailProtection");
        }
        if (this.timeStamping) {
            keyUsages.push("timeStamping");
        }
        if (this.ocspSigning) {
            keyUsages.push("ocspSigning");
        }
        if (this.ipsecEndSystem) {
            keyUsages.push("ipsecEndSystem");
        }
        if (this.ipsecTunnel) {
            keyUsages.push("ipsecTunnel");
        }
        if (this.ipsecUser) {
            keyUsages.push("ipsecUser");
        }
        return keyUsages;
    }

    fromStringArray(keyUsages: Array<string>) {
        this.serverAuth = false;
        this.clientAuth = false;
        this.codeSigning = false;
        this.emailProtection = false;
        this.timeStamping = false;
        this.ocspSigning = false;
        this.ipsecEndSystem = false;
        this.ipsecTunnel = false;
        this.ipsecUser = false;
        for (let i = 0; i < 9; i++) {
            if (!keyUsages[i])
                return
            if (keyUsages[i] === "serverAuth") {
                this.serverAuth = true;
                continue;
            }
            if (keyUsages[i] === "clientAuth") {
                this.clientAuth = true;
                continue;
            }
            if (keyUsages[i] === "codeSigning") {
                this.codeSigning = true;
                continue;
            }
            if (keyUsages[i] === "emailProtection") {
                this.emailProtection = true;
                continue;
            }
            if (keyUsages[i] === "timeStamping") {
                this.timeStamping = true;
                continue;
            }
            if (keyUsages[i] === "ocspSigning") {
                this.ocspSigning = true;
                continue;
            }
            if (keyUsages[i] === "ipsecEndSystem") {
                this.ipsecEndSystem = true;
                continue;
            }
            if (keyUsages[i] === "ipsecTunnel") {
                this.ipsecTunnel = true;
                continue;
            }
            if (keyUsages[i] === "ipsecUser") {
                this.ipsecUser = true;
                continue;
            }
        }
    }

}