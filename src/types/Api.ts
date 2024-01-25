interface APIResponse {
    message: string;
    error?: string;
    code: number;
}

interface TokenResponse extends APIResponse {
    data: {
        token: string;
    }
}

export type { APIResponse, TokenResponse }