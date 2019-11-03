export class User {
  id: number;
  name: string;
  emailAddress: string;
  passwordHash: string;
  salt: string;

  public sanitize() {
    this.passwordHash = null;
    this.salt = null;
  }
}
