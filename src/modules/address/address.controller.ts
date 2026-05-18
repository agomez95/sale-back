import { Request, Response } from 'express';
import * as addressService from './address.service';
import { CreateAddressDTO, UpdateAddressDTO } from '../../shared/types/index';

// GET /sales/api/address/countries
export const getCountries = async (
    req: Request,
    res: Response
): Promise<void> => {
    const countries = await addressService.getCountries();
    res.json({ success: true, data: countries });
};

// GET /sales/api/address/
export const getMyAddresses = async (
    req: Request,
    res: Response
): Promise<void> => {
    const addresses = await addressService.getMyAddresses(req.user!.userId);
    res.json({ success: true, data: addresses });
};

// GET /sales/api/address/:id
export const getById = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    const address = await addressService.getAddressById(
        parseInt(req.params.id),
        req.user!.userId
    );
    res.json({ success: true, data: address });
};

// POST /sales/api/address/
export const create = async (
    req: Request<{}, {}, CreateAddressDTO>,
    res: Response
): Promise<void> => {
    const id = await addressService.createAddress(
        req.user!.userId,
        req.body
    );
    res.status(201).json({ success: true, data: { id } });
};

// PATCH /sales/api/address/:id
export const update = async (
    req: Request<{ id: string }, {}, UpdateAddressDTO>,
    res: Response
): Promise<void> => {
    await addressService.updateAddress(
        parseInt(req.params.id),
        req.user!.userId,
        req.body
    );
    res.json({ success: true, message: 'Address updated' });
};

// PATCH /sales/api/address/:id/default
export const setDefault = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await addressService.setDefaultAddress(
        parseInt(req.params.id),
        req.user!.userId
    );
    res.json({ success: true, message: 'Default address updated' });
};

// DELETE /sales/api/address/:id
export const remove = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await addressService.deleteAddress(
        parseInt(req.params.id),
        req.user!.userId
    );
    res.json({ success: true, message: 'Address deleted' });
};