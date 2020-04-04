export class User {

    public id: number;
    public givenName: string;
    public lastName: string;
    public commonName: string;
    public country: string;
    public organization: string;
    public organizationalUnit: string;
    public locality: string;
    public email: string;

    constructor(id: number, givenName: string, lastName: string, commonName: string, country: string, organization: string, organizationalUnit: string,
        locality: string, email: string) {
        this.id = id;
        this.givenName = givenName;
        this.lastName = lastName;
        this.commonName = commonName;
        this.country = country;
        this.organization = organization;
        this.organizationalUnit = organizationalUnit;
        this.locality = locality;
        this.email = email;
    }
    
}