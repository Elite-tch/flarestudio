import { describe, it, expect } from 'vitest';
import { UtilsModule } from '../src/modules/utils/UtilsModule';

describe('UtilsModule', () => {
    const utils = new UtilsModule();

    describe('Unit Conversion', () => {
        it('should convert Ether to Wei', () => {
            expect(utils.toWei('1').toString()).toBe('1000000000000000000');
            expect(utils.toWei('0.5').toString()).toBe('500000000000000000');
        });

        it('should convert Wei to Ether', () => {
            expect(utils.fromWei('1000000000000000000')).toBe('1.0');
            expect(utils.fromWei('500000000000000000')).toBe('0.5');
        });
    });

    describe('Address Validation', () => {
        it('should validate correct addresses', () => {
            expect(utils.isValidAddress('0x5B38Da6a701c568545dCfcB03FcB875f56beddC4')).toBe(true);
        });

        it('should reject incorrect addresses', () => {
            expect(utils.isValidAddress('0xinvalid')).toBe(false);
            expect(utils.isValidAddress('notanaddress')).toBe(false);
        });

        it('should checksum addresses', () => {
            const addr = '0x5b38da6a701c568545dcfcb03fcb875f56beddc4';
            const checksummed = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4';
            expect(utils.toChecksumAddress(addr)).toBe(checksummed);
        });
    });
});
