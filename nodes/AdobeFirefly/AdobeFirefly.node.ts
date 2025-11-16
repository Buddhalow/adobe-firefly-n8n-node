import axios from "axios";
import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";

export class AdobeFirefly implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Adobe Firefly",
    name: "adobeFirefly",
    group: ["transform"],
    version: 1,
    description: "Generate images with Adobe Firefly API",
    defaults: {
      name: "Adobe Firefly",
    },
    inputs: ["main"],
    outputs: ["main"],
    credentials: [
      {
        name: "adobeFireflyApi",
        required: true,
      },
    ],
    properties: [
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        options: [
          {
            name: "Generate Image",
            value: "generateImage",
            description: "Generate an image from a text prompt",
          },
        ],
        default: "generateImage",
        required: true,
      },
      {
        displayName: "Prompt",
        name: "prompt",
        type: "string",
        default: "",
        required: true,
        placeholder: "A futuristic cityscape at sunset",
        description: "Text description of the image to generate",
      },
      {
        displayName: "Number of Images",
        name: "numImages",
        type: "number",
        typeOptions: {
          minValue: 1,
          maxValue: 4,
        },
        default: 1,
        description: "How many images to generate",
      },
      {
        displayName: "Width",
        name: "width",
        type: "number",
        default: 1024,
        description: "Width of the generated image in pixels",
      },
      {
        displayName: "Height",
        name: "height",
        type: "number",
        default: 1024,
        description: "Height of the generated image in pixels",
      },
      {
        displayName: "Negative Prompt",
        name: "negativePrompt",
        type: "string",
        default: "",
        description: "Describe what you do NOT want to see in the image",
      },
      {
        displayName: "Style Preset",
        name: "stylePreset",
        type: "options",
        options: [
          {
            name: "None",
            value: "",
          },
          {
            name: "Photo",
            value: "photo",
          },
          {
            name: "Art",
            value: "art",
          },
          {
            name: "Comic",
            value: "comic",
          },
          {
            name: "Watercolor",
            value: "watercolor",
          },
        ],
        default: "",
        description: "High-level style preset to influence the look of the image",
      },
      {
        displayName: "Seed",
        name: "seed",
        type: "number",
        default: 0,
        description:
          "Random seed for reproducible results. Use 0 to let Firefly pick a seed.",
      },
      {
        displayName: "CFG Scale",
        name: "cfgScale",
        type: "number",
        typeOptions: {
          minValue: 1,
          maxValue: 20,
        },
        default: 7,
        description:
          "How strongly the model should follow the prompt vs. creativity (higher = closer to prompt)",
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const credentials = await this.getCredentials("adobeFireflyApi");
    const clientId = credentials.clientId as string;
    const clientSecret = credentials.clientSecret as string;

    for (let i = 0; i < items.length; i++) {
      const prompt = this.getNodeParameter("prompt", i) as string;
      const numImages = this.getNodeParameter("numImages", i, 1) as number;
      const width = this.getNodeParameter("width", i, 1024) as number;
      const height = this.getNodeParameter("height", i, 1024) as number;
      const negativePrompt = this.getNodeParameter(
        "negativePrompt",
        i,
        "",
      ) as string;
      const stylePreset = this.getNodeParameter("stylePreset", i, "") as string;
      const seed = this.getNodeParameter("seed", i, 0) as number;
      const cfgScale = this.getNodeParameter("cfgScale", i, 7) as number;

      // 1) Get access token from Adobe IMS
      const tokenResponse = await axios.post(
        "https://ims-na1.adobelogin.com/ims/token/v3",
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret,
          scope: "openid,AdobeID,session,additional_info,read_organizations,firefly_api,ff_apis",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      const accessToken = tokenResponse.data.access_token as string;

      // 2) Call Firefly image generation async endpoint
      const fireflyResponse = await axios.post(
        "https://firefly-api.adobe.io/v3/images/generate/async",
        {
          prompt,
          negativePrompt: negativePrompt || undefined,
          numVariations: numImages,
          size: {
            width,
            height,
          },
          style: stylePreset || undefined,
          seed: seed || undefined,
          cfgScale,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-api-key": clientId,
            "Content-Type": "application/json",
          },
        },
      );

      returnData.push({
        json: fireflyResponse.data,
      });
    }

    return [returnData];
  }
}
