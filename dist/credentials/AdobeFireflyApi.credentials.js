"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdobeFireflyApi = void 0;
class AdobeFireflyApi {
    constructor() {
        this.name = "adobeFireflyApi";
        this.displayName = "Adobe Firefly API";
        this.documentationUrl = "https://developer.adobe.com/firefly-services/docs/firefly-api/";
        this.properties = [
            {
                displayName: "Client ID",
                name: "clientId",
                type: "string",
                default: "",
                typeOptions: {
                    password: false,
                },
                required: true,
                description: "Adobe Developer Console Client ID for Firefly Services",
            },
            {
                displayName: "Client Secret",
                name: "clientSecret",
                type: "string",
                default: "",
                typeOptions: {
                    password: true,
                },
                required: true,
                description: "Adobe Developer Console Client Secret for Firefly Services",
            },
        ];
    }
}
exports.AdobeFireflyApi = AdobeFireflyApi;
