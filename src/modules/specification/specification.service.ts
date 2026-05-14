import db from '../../shared/database/connection';
import { QUERIES } from '../../shared/database/queries';
import { NotFoundError } from '../../shared/errors/index';
import { getSubcategoryById } from '../subcategory/subcategory.service';
import { 
    SpecificationRow,
    CreateSpecDTO,
    CreateSpecValueDTO
} from '../../shared/types/index';

// ─── Helpers de existencia ────────────────────────────

const specExists = async (id: number): Promise<void> => {
    const result = await db.query<{ fn_spec_exist: boolean }>(
        QUERIES.SPECIFICATION.EXISTS,
        [id]
    );

    if (!result[0].fn_spec_exist) {
        throw new NotFoundError('Specification not found', { id });
    }
};

const specValueExists = async (id: number): Promise<void> => {
    const result = await db.query<{ fn_spec_val_exist: boolean }>(
        QUERIES.SPECIFICATION.EXISTS_VAL,
        [id]
    );

    if (!result[0].fn_spec_val_exist) {
        throw new NotFoundError('Specification value not found', { id });
    }
};

// ─── Services ─────────────────────────────────────────

export const createSpec = async (data: CreateSpecDTO): Promise<number> => {
    await getSubcategoryById(data.subcategory_id);

    const result = await db.callFunction<{ fn_add_spec: number }>(
        QUERIES.SPECIFICATION.ADD,
        {
            specification_constant_id: data.specification_constant_id,
            subcategory_id:            data.subcategory_id
        }
    );

    return result[0].fn_add_spec;
};

export const createSpecValue = async (data: CreateSpecValueDTO): Promise<number> => {
    await specExists(data.specification_id); 

    const result = await db.callFunction<{ fn_add_spec_val: number }>(
        QUERIES.SPECIFICATION.ADD_VAL,
        {
            value:            data.value,
            specification_id: data.specification_id
        }
    );

    return result[0].fn_add_spec_val;
};

export const activateSpec = async (id: number): Promise<void> => {
    await specExists(id); // ← verifica que existe
    await db.callFunction(QUERIES.SPECIFICATION.ACTIVATE, { id });
};

export const deactivateSpec = async (id: number): Promise<void> => {
    await specExists(id);
    await db.callFunction(QUERIES.SPECIFICATION.DEACTIVATE, { id });
};

export const activateSpecValue = async (id: number): Promise<void> => {
    await specValueExists(id);
    await db.callFunction(QUERIES.SPECIFICATION.ACT_VAL, { id });
};

export const deactivateSpecValue = async (id: number): Promise<void> => {
    await specValueExists(id);
    await db.callFunction(QUERIES.SPECIFICATION.DEACT_VAL, { id });
};