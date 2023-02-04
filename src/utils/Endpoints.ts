declare global {
    interface Window {
        _env_: any;
    }
}

let endpoint = `http://localhost:5000`;
if (window._env_ && window._env_.API_URL) {
    endpoint = window._env_.API_URL;
}

export const Search = `${endpoint}/search`;
