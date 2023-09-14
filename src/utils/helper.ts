import * as CryptoJS from "crypto-js";
import * as dotenv from "dotenv";

dotenv.config()
const passphraseDefault = process.env.SECRET_PASSPHRASE || 'bccfe830a3ec43489cf356e79a6f2c3e'

const generateRandom = async (length: number) => {
    let result = ''
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result
}

const encryptWithAES = (text: string, passphrase: string = passphraseDefault) => {
    return CryptoJS.AES.encrypt(text, passphrase).toString();
};

const decryptWithAES = (ciphertext: string, passphrase: string = passphraseDefault) => {
    return CryptoJS.AES.decrypt(ciphertext, passphrase).toString(CryptoJS.enc.Utf8);
};

export default {generateRandom, encryptWithAES, decryptWithAES}