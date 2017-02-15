import Ember            from 'ember';
import CryptoJS         from 'cryptojs';
import { jwt_decode }   from 'ember-cli-jwt-decode';

export default Ember.Route.extend({
    setupController(controller) {
        let header = {
            "alg": "HS256",
            "typ": "JWT"
        };
        let payload = {
            "sub": "1234567890",
            "name": "John Doe",
            "isAdmin": true
        };

        let secret = "Let's Rock !";

        let signedToken = this.generateToken(header, payload, secret);

        console.log(signedToken);
        console.log(jwt_decode(signedToken));
    },

    generateToken (header, payload, secret) {
        let stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
        let encodedHeader = this.base64url(stringifiedHeader);

        let stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(payload));
        let encodedData = this.base64url(stringifiedData);

        let token = encodedHeader + "." + encodedData;

        let signature = CryptoJS.HmacSHA256(token, secret);
        signature = this.base64url(signature);

        return token + "." + signature;
    },

    base64url(source) {
        // Encode in classical base64
        let encodedSource = CryptoJS.enc.Base64.stringify(source);

        // Remove padding equal characters
        encodedSource = encodedSource.replace(/=+$/, '');

        // Replace characters according to base64url specifications
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');

        return encodedSource;
    },
});
