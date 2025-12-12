/**
 * Base error class for all SDK errors
 */
export class SDKError extends Error {
    constructor(
        message: string,
        public code: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'SDKError';
        Object.setPrototypeOf(this, SDKError.prototype);
    }
}

/**
 * FTSO module errors
 */
export class FTSOError extends SDKError {
    constructor(message: string, code: string, details?: unknown) {
        super(message, code, details);
        this.name = 'FTSOError';
        Object.setPrototypeOf(this, FTSOError.prototype);
    }
}

/**
 * FDC module errors
 */
export class FDCError extends SDKError {
    constructor(message: string, code: string, details?: unknown) {
        super(message, code, details);
        this.name = 'FDCError';
        Object.setPrototypeOf(this, FDCError.prototype);
    }
}

/**
 * fAssets module errors
 */
export class FAssetsError extends SDKError {
    constructor(message: string, code: string, details?: unknown) {
        super(message, code, details);
        this.name = 'FAssetsError';
        Object.setPrototypeOf(this, FAssetsError.prototype);
    }
}

/**
 * Wallet module errors
 */
export class WalletError extends SDKError {
    constructor(message: string, code: string, details?: unknown) {
        super(message, code, details);
        this.name = 'WalletError';
        Object.setPrototypeOf(this, WalletError.prototype);
    }
}

/**
 * Staking module errors
 */
export class StakingError extends SDKError {
    constructor(message: string, code: string, details?: unknown) {
        super(message, code, details);
        this.name = 'StakingError';
        Object.setPrototypeOf(this, StakingError.prototype);
    }
}

/**
 * State Connector module errors
 */
export class StateConnectorError extends SDKError {
    constructor(message: string, code: string, details?: unknown) {
        super(message, code, details);
        this.name = 'StateConnectorError';
        Object.setPrototypeOf(this, StateConnectorError.prototype);
    }
}

/**
 * Error codes
 */
export const ErrorCodes = {
    // General
    INVALID_PARAMETER: 'INVALID_PARAMETER',
    NETWORK_ERROR: 'NETWORK_ERROR',
    NOT_INITIALIZED: 'NOT_INITIALIZED',

    // FTSO
    SYMBOL_NOT_FOUND: 'SYMBOL_NOT_FOUND',
    PRICE_NOT_AVAILABLE: 'PRICE_NOT_AVAILABLE',
    INVALID_TIME_RANGE: 'INVALID_TIME_RANGE',

    // FDC
    ATTESTATION_NOT_FOUND: 'ATTESTATION_NOT_FOUND',
    VERIFICATION_FAILED: 'VERIFICATION_FAILED',
    INVALID_PROOF: 'INVALID_PROOF',

    // fAssets
    ASSET_NOT_SUPPORTED: 'ASSET_NOT_SUPPORTED',
    INSUFFICIENT_COLLATERAL: 'INSUFFICIENT_COLLATERAL',
    MINTING_FAILED: 'MINTING_FAILED',
    REDEMPTION_FAILED: 'REDEMPTION_FAILED',

    // Wallet
    WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
    INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
    TRANSACTION_FAILED: 'TRANSACTION_FAILED',
    SIGNATURE_REJECTED: 'SIGNATURE_REJECTED',

    // Staking
    DELEGATION_FAILED: 'DELEGATION_FAILED',
    CLAIM_FAILED: 'CLAIM_FAILED',
    PROVIDER_NOT_FOUND: 'PROVIDER_NOT_FOUND',
    NO_REWARDS: 'NO_REWARDS',
    INVALID_PARAMS: 'INVALID_PARAMS',

    // State Connector
    PROOF_VERIFICATION_FAILED: 'PROOF_VERIFICATION_FAILED',
    INVALID_ATTESTATION_TYPE: 'INVALID_ATTESTATION_TYPE',
} as const;
