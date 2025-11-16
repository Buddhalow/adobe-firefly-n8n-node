import type { INodeProperties } from "n8n-workflow";

export class AdobeFireflyApi implements ICredentialType {
  name = "adobeFireflyApi";
  displayName = "Adobe Firefly API";
  documentationUrl = "https://developer.adobe.com/firefly-services/docs/firefly-api/";
  properties: INodeProperties[] = [
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
