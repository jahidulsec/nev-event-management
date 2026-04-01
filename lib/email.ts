import nodemailer from "nodemailer";
import ntlmAuth from "nodemailer-ntlm-auth";

export class EmailService {
  private _user!: string;
  private _password!: string;
  private _host: string = "localhost";
  private _port: number = 587;
  private _secure: boolean = false;
  private _domain?: string;

  setAuth(user: string, password: string, domain?: string): this {
    this._user = user;
    this._password = password;
    this._domain = domain;
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

  setSecure(isSecure: boolean) {
    this._secure = isSecure;
    return this;
  }

  build() {
    if (!this._user || !this._password) {
      throw new Error("Auth required");
    }

    return nodemailer.createTransport({
      host: this._host,
      port: this._port,
      secure: this._secure,

      auth: {
        type: "custom",
        method: "NTLM",
        user: this._user,
        pass: this._password,
        domain: this._domain,
      },

      authMethod: "NTLM",

      tls: {
        rejectUnauthorized: false,
      },

      // 🔥 THIS is the correct way
      ...ntlmAuth(),
    });
  }
}