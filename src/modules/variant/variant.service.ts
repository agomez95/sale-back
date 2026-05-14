import db from '../../shared/database/connection';
import { QUERIES } from '../../shared/database/queries';
import { NotFoundError } from '../../shared/errors/index';
import { getProductById } from '../product/product.service';
import { 
    CreateVariantDTO, 
    CreateVariantSpecValDTO 
} from '../../shared/types/index';

// ─── Helpers de existencia ────────────────────────────

const variantExists = async (id: number): Promise<void> => {
    const result = await db.query<{ fn_variant_exist: boolean }>(
        QUERIES.VARIANT.EXISTS,
        [id]
    );

    if (!result[0].fn_variant_exist) {
        throw new NotFoundError('Variant not found', { id });
    }
};

// ─── Services ─────────────────────────────────────────

export const createVariant = async (data: CreateVariantDTO): Promise<number> => {
    // Verifica que el producto existe
    await getProductById(data.product_id);

    const result = await db.callFunction<{ fn_add_variant: number }>(
        QUERIES.VARIANT.ADD,
        {
            name:       data.name,
            stock:      data.stock,
            cost:       data.cost,
            product_id: data.product_id
        }
    );

    return result[0].fn_add_variant;
};

export const createVariantSpecVal = async (
    data: CreateVariantSpecValDTO
): Promise<number> => {
    // Verifica que la variante existe
    await variantExists(data.variant_id);

    const result = await db.callFunction<{ fn_add_variant_spec_val: number }>(
        QUERIES.VARIANT.ADD_SPEC_VAL,
        {
            variant_id:             data.variant_id,
            specification_value_id: data.specification_value_id
        }
    );

    return result[0].fn_add_variant_spec_val;
};

export const deleteVariant = async (id: number): Promise<void> => {
    // Verifica que la variante existe
    await variantExists(id);

    // 1. Elimina spec values de la variante
    await db.callFunction(QUERIES.VARIANT.DEL_SPEC_VAL, { id });

    // 2. Elimina la variante
    // El trigger TR_DEL_PHOTO_ON_VARIANT elimina las fotos automáticamente
    await db.callFunction(QUERIES.VARIANT.DELETE, { id });
};

export const activateVariant = async (id: number): Promise<void> => {
    await variantExists(id);
    await db.callFunction(QUERIES.VARIANT.ACTIVATE, { id });
};

export const deactivateVariant = async (id: number): Promise<void> => {
    await variantExists(id);
    await db.callFunction(QUERIES.VARIANT.DEACTIVATE, { id });
};