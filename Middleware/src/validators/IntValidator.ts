export const maxValue = (key: string, max: number) => {
    return {
        validator: (v: Array<any>) => {
            return v.length <= max;
        },
        message: `La valeur de '${key}' doit être inférieure ou égale à ${max}`
    };
};

export const minValue = (key: string, min: number) => {
    return {
        validator: (v: Array<any>) => {
            return v.length >= min;
        },
        message: `La valeur de '${key}' doit être supérieure ou égale à ${min}`
    };
};

export const valueBetween = (key: string, min: number, max: number) => {
    return {
        validator: (v: Array<any>) => {
            return v.length >= min && v.length <= max;
        },
        message: `La valeur de '${key}' doit être entre ${min} et ${max}`
    };
}