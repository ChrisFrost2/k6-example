import http from "k6/http";

class ParametersAndOperations {
    get(url, name = null) {
        let parameters = {            
            headers: { 'x-api-key': 'reqres-free-v1' }
        };

        if (name != null) {
            parameters = {
                headers: { 'x-api-key': 'reqres-free-v1' },
                tags: { name: `${name}` },
            };
        }

        return http.get(url, parameters);
    }
}

export default new ParametersAndOperations();