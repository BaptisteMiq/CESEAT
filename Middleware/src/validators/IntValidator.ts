export const maxValue = (key: string, max: number) => {
    return {
        validator: (v: number) => {
            return v <= max;
        },
        message: `La valeur de '${key}' doit être inférieure ou égale à ${max}`
    };
};

export const minValue = (key: string, min: number) => {
    return {
        validator: (v: number) => {
            return v >= min;
        },
        message: `La valeur de '${key}' doit être supérieure ou égale à ${min}`
    };
};

export const valueBetween = (key: string, min: number, max: number) => {
    return {
        validator: (v: number) => {
            return v >= min && v <= max;
        },
        message: `La valeur de '${key}' doit être entre ${min} et ${max}`
    };
}