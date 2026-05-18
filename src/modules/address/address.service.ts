import db from '../../shared/database/connection';
import { QUERIES } from '../../shared/database/queries';
import { NotFoundError } from '../../shared/errors/index';
import { logSuccess } from '../../shared/utils';
import { 
    AddressRow, 
    CountryRow,
    CreateAddressDTO,
    UpdateAddressDTO
} from '../../shared/types/index';

export const getCountries = async (): Promise<CountryRow[]> => {
    return db.query<CountryRow>(QUERIES.COUNTRY.GET_ALL);
};

export const getMyAddresses = async (
    customerId: string
): Promise<AddressRow[]> => {
    return db.callFunction<AddressRow>(
        QUERIES.ADDRESS.GET_BY_CUSTOMER,
        { customer_id: customerId },
        true
    );
};

export const getAddressById = async (
    addressId: number,
    customerId: string
): Promise<AddressRow> => {
    const result = await db.callFunction<AddressRow>(
        QUERIES.ADDRESS.GET_BY_ID,
        { address_id: addressId, customer_id: customerId },
        true
    );

    if (!result.length) {
        throw new NotFoundError('Address not found');
    }

    return result[0];
};

export const createAddress = async (
    customerId: string,
    data: CreateAddressDTO
): Promise<number> => {
    const result = await db.callFunction<{ fn_add_address: number }>(
        QUERIES.ADDRESS.ADD,
        { 
            customer_id: customerId,
            number: data.number,
            street: data.street,
            address_line_1: data.address_line_1 || null,
            address_line_2: data.address_line_2 || null, 
            city: data.city,
            state_province: data.state_province,
            postal_code: data.postal_code,
            country_id: data.country_id
        }
    );

    logSuccess('Address created', { customerId });
    return result[0].fn_add_address;
};

export const updateAddress = async (
    addressId: number,
    customerId: string,
    data: UpdateAddressDTO
): Promise<void> => {
    const result = await db.callFunction<{ fn_edit_address: boolean }>(
        QUERIES.ADDRESS.EDIT,
        {
            address_id: addressId,
            customer_id: customerId,
            number: data.number,
            street: data.street,
            address_line_1: data.address_line_1 || null,
            address_line_2: data.address_line_2 || null, 
            city: data.city,
            state_province: data.state_province,
            postal_code: data.postal_code,
            country_id: data.country_id
        }
    );

    if (!result[0].fn_edit_address) {
        throw new NotFoundError('Address not found', { addressId });
    }

    logSuccess('Address updated', { addressId, customerId });
};

export const deleteAddress = async (
    addressId: number,
    customerId: string
): Promise<void> => {
    const result = await db.callFunction<{ fn_del_address: boolean }>(
        QUERIES.ADDRESS.DELETE,
        { address_id: addressId, customer_id: customerId }
    );

    if (!result[0].fn_del_address) {
        throw new NotFoundError('Address not found', { addressId });
    }

    logSuccess('Address deleted', { addressId, customerId });
};

export const setDefaultAddress = async (
    addressId: number,
    customerId: string
): Promise<void> => {
    const result = await db.callFunction<{ fn_set_default_address: boolean }>(
        QUERIES.ADDRESS.SET_DEFAULT,
        { address_id: addressId, customer_id: customerId }
    );

    if (!result[0].fn_set_default_address) {
        throw new NotFoundError('Address not found', { addressId });
    }

    logSuccess('Default address updated', { addressId, customerId });
};
