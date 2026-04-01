import nodemailer from "nodemailer";

export class EmailService {
  private _user!: string;
  private _password!: string;
  private _secure: boolean = false;
  private _host: string = "localhost";
  private _port: number = 587;

  setAuth(user: string, password: string): this {
    this._user = user;
    this._password = password;
    return this;
  }

  setSecureMethod(isSecure: boolean) {
    this._secure = isSecure;
    return this;
  }
  setHost(host: string) {
    this._host = host;
    return this;
  }
  setPort(port: number) {
    this._port = port;
    return this;
  }

  build() {
    if (!this._user || !this._password) {
      throw new Error("Email auth (user & password) is required");
    }

    return nodemailer.createTransport({
      host: this._host,
      port: this._port,
      secure: this._secure,
      auth: {
        user: this._user,
        // pass: this._password,
      },
      ...(!this._secure && {
        tls: {
          rejectUnauthorized: false,
        },
      }),
    });
  }
}
