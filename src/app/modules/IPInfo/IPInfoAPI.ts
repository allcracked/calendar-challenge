import { APIIPInfoResponse } from './IPInfoInterfaces';

class IPInfo {
    private token = process.env.IP_INFO_TOKEN;

    private callURL = `https://ipinfo.io/?token=${this.token}`;

    /**
     * Gets visitor geolocalization based on their IP Address, this is only used to provide weather data.
     * @returns Formatted response from the API containing location data.
     */
    async getLocationData(): Promise<APIIPInfoResponse> {
        const ipInfoResponse = await fetch(this.callURL);
        const ipInfoDetails: APIIPInfoResponse = await ipInfoResponse.json();
        return ipInfoDetails;
    }
}

const IPInfoAPI = new IPInfo();

export default IPInfoAPI;
